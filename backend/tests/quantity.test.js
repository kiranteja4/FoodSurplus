import mongoose from 'mongoose';
import {
  compareQuantities,
  parseQuantity,
  QUANTITY_UNITS,
  toQuantityString,
  validateQuantityPair,
  validateQuantityUnit,
} from '../src/utils/quantity.js';

describe('quantity utilities', () => {
  it('validates the approved units', () => {
    expect(QUANTITY_UNITS).toEqual(['kg', 'g', 'L', 'mL', 'servings', 'packets']);
    expect(validateQuantityUnit('kg')).toBe('kg');
    expect(() => validateQuantityUnit('boxes')).toThrow('Unsupported quantity unit');
  });

  it.each([
    ['kg', '1.234'],
    ['g', '12'],
    ['L', '0.125'],
    ['mL', '250'],
    ['servings', '2.25'],
    ['packets', '0.5'],
  ])('parses valid %s quantity %s as Decimal128', (unit, value) => {
    expect(parseQuantity(value, unit)).toBeInstanceOf(mongoose.Types.Decimal128);
    expect(toQuantityString(parseQuantity(value, unit))).toBe(value);
  });

  it.each([
    ['kg', '1.2345'],
    ['kg', '1.2340'],
    ['g', '1.1'],
    ['L', '1.0001'],
    ['mL', '10.5'],
    ['servings', '1.001'],
  ])('rejects excess precision for %s value %s', (unit, value) => {
    expect(() => parseQuantity(value, unit)).toThrow('decimal places');
  });

  it.each(['0', '-1', 'NaN', 'Infinity', '1e2', '1.2.3', ''])('rejects invalid quantity %s', (value) => {
    expect(() => parseQuantity(value, 'kg')).toThrow();
  });

  it('rejects values outside Decimal128 range without imposing a product maximum', () => {
    expect(() => parseQuantity('9'.repeat(1000), 'kg')).toThrow(/range/);
    expect(() => parseQuantity(`0.${'0'.repeat(6176)}1`, 'packets')).toThrow(/range/);
  });

  it('compares decimals exactly beyond JavaScript safe integer precision', () => {
    expect(compareQuantities('9007199254740993.01', '9007199254740993.02')).toBe(-1);
    expect(compareQuantities('1.2300', '1.23')).toBe(0);
    expect(() => compareQuantities(1.1, 1.2)).toThrow(/JavaScript numbers/);
  });

  it('serializes Decimal128 exponent values as exact plain decimal strings', () => {
    expect(toQuantityString(parseQuantity('10000000000000000000000000000000000', 'g')))
      .toBe('10000000000000000000000000000000000');
    expect(toQuantityString(parseQuantity('0.0000000000000000000000000000000000001', 'packets')))
      .toBe('0.0000000000000000000000000000000000001');
  });

  it('enforces available quantity not exceeding total quantity', () => {
    expect(validateQuantityPair('1.250', '1.200', 'kg').availableQuantity.toString()).toBe('1.200');
    expect(() => validateQuantityPair('1.2', '1.201', 'kg')).toThrow('must not exceed');
  });

  it('accepts fractional packets without inventing a universal fractional scale', () => {
    expect(parseQuantity('0.125', 'packets').toString()).toBe('0.125');
  });

  it('normalizes and parses valid leading-decimal values and rejects invalid leading decimals', () => {
    expect(parseQuantity('.5', 'kg')).toBeInstanceOf(mongoose.Types.Decimal128);
    expect(toQuantityString(parseQuantity('.5', 'kg'))).toBe('0.5');
    expect(compareQuantities('.5', '0.5')).toBe(0);
    expect(compareQuantities('.25', '.5')).toBe(-1);
    expect(() => parseQuantity('-.5', 'kg')).toThrow('greater than zero');
    expect(() => parseQuantity('.0', 'kg')).toThrow('greater than zero');
    expect(() => parseQuantity('.1234', 'kg')).toThrow('decimal places');
  });
});
