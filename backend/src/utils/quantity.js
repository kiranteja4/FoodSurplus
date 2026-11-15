import mongoose from 'mongoose';

export const QUANTITY_UNITS = Object.freeze([
  'kg',
  'g',
  'L',
  'mL',
  'servings',
  'packets',
]);

const precisionByUnit = Object.freeze({
  kg: 3,
  g: 0,
  L: 3,
  mL: 0,
  servings: 2,
});

const decimalInputPattern = /^-?(?:\d+|\d*\.\d+)$/;

function assertUnit(unit) {
  if (!QUANTITY_UNITS.includes(unit)) {
    throw new TypeError(`Unsupported quantity unit: ${unit}`);
  }
}

function parseDecimalParts(value) {
  let source = typeof value === 'string'
    ? value
    : value instanceof mongoose.Types.Decimal128
      ? value.toString()
      : undefined;
  if (source?.startsWith('.')) {
    source = `0${source}`;
  } else if (source?.startsWith('-.')) {
    source = `-0${source.slice(1)}`;
  }
  const match = source?.match(/^(-?)(\d+)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/);
  if (!match) throw new TypeError('Quantity must be a finite decimal value');

  const [, sign, integerPart, fractionPart = '', exponentPart = '0'] = match;
  const exponent = Number(exponentPart);
  if (!Number.isSafeInteger(exponent)) throw new RangeError('Quantity is out of range');

  let digits = `${integerPart}${fractionPart}`.replace(/^0+/, '') || '0';
  let scale = fractionPart.length - exponent;
  while (digits.length > 1 && digits.endsWith('0')) {
    digits = digits.slice(0, -1);
    scale -= 1;
  }

  return { sign: digits === '0' ? '' : sign, digits, scale };
}

function decimalToScaledInteger(parts, scale) {
  const integer = BigInt(parts.digits) * (10n ** BigInt(scale - parts.scale));
  return parts.sign === '-' ? -integer : integer;
}

function toPlainDecimal(value) {
  const parts = parseDecimalParts(value);
  const sign = parts.sign === '-' ? '-' : '';

  if (parts.scale <= 0) return `${sign}${parts.digits}${'0'.repeat(-parts.scale)}`;
  if (parts.digits.length <= parts.scale) {
    return `${sign}0.${'0'.repeat(parts.scale - parts.digits.length)}${parts.digits}`;
  }

  const point = parts.digits.length - parts.scale;
  return `${sign}${parts.digits.slice(0, point)}.${parts.digits.slice(point)}`;
}

function asDecimal128(value, fieldName) {
  if (value instanceof mongoose.Types.Decimal128) return value;
  if (typeof value !== 'string' || !decimalInputPattern.test(value)) {
    throw new TypeError(`${fieldName} must be a decimal string`);
  }

  try {
    return mongoose.Types.Decimal128.fromString(value);
  } catch {
    throw new RangeError(`${fieldName} is outside the supported Decimal128 range`);
  }
}

export function validateQuantityUnit(unit) {
  assertUnit(unit);
  return unit;
}

export function parseQuantity(value, unit, fieldName = 'quantity') {
  assertUnit(unit);
  const decimal = asDecimal128(value, fieldName);
  const source = typeof value === 'string' ? value : decimal.toString();
  const parts = parseDecimalParts(source);

  if (parts.sign === '-') {
    throw new RangeError(`${fieldName} must be greater than zero`);
  }
  if (parts.digits === '0') {
    throw new RangeError(`${fieldName} must be greater than zero`);
  }
  if (compareQuantities(decimal, '0') <= 0) {
    throw new RangeError(`${fieldName} is outside the supported Decimal128 range`);
  }

  const allowedPrecision = precisionByUnit[unit];
  const inputFractionDigits = source.match(/^-?(?:\d*)\.(\d+)$/)?.[1].length;
  const decimalPlaces = inputFractionDigits ?? Math.max(parts.scale, 0);
  if (allowedPrecision !== undefined && decimalPlaces > allowedPrecision) {
    throw new RangeError(`${fieldName} supports at most ${allowedPrecision} decimal places for ${unit}`);
  }

  // Fractional packets have no universal scale. The model accepts exact positive
  // Decimal128 fractions; a future input workflow must establish whether a partial
  // packet is meaningful for the specific donation instead of applying a heuristic.
  return decimal;
}

export function compareQuantities(left, right) {
  for (const value of [left, right]) {
    if (typeof value === 'number') {
      throw new TypeError('Quantities must not be compared using JavaScript numbers');
    }
    if (typeof value === 'string') asDecimal128(value, 'quantity');
  }
  const leftParts = parseDecimalParts(left);
  const rightParts = parseDecimalParts(right);
  const scale = Math.max(leftParts.scale, rightParts.scale, 0);
  const leftInteger = decimalToScaledInteger(leftParts, scale);
  const rightInteger = decimalToScaledInteger(rightParts, scale);
  return leftInteger < rightInteger ? -1 : leftInteger > rightInteger ? 1 : 0;
}

export function validateQuantityPair(quantity, availableQuantity, unit) {
  const total = parseQuantity(quantity, unit, 'quantity');
  const available = parseQuantity(availableQuantity, unit, 'availableQuantity');

  if (compareQuantities(available, total) > 0) {
    throw new RangeError('availableQuantity must not exceed quantity');
  }

  return { quantity: total, availableQuantity: available };
}

export function toQuantityString(value) {
  const decimal = asDecimal128(value, 'quantity');
  return toPlainDecimal(decimal);
}
