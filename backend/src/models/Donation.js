import mongoose from 'mongoose';
import { DONATION_CATEGORIES } from '../../../shared/donationCategories.mjs';
import { compareQuantities, parseQuantity, QUANTITY_UNITS } from '../utils/quantity.js';

const { Decimal128, ObjectId } = mongoose.Schema.Types;

function validateQuantityField(fieldName) {
  return function validateStoredQuantity(value) {
    if (!this.quantityUnit || !QUANTITY_UNITS.includes(this.quantityUnit)) return true;
    parseQuantity(value, this.quantityUnit, fieldName);
    return true;
  };
}

const donationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: DONATION_CATEGORIES },
    quantity: {
      type: Decimal128,
      required: true,
      validate: { validator: validateQuantityField('quantity') },
    },
    availableQuantity: {
      type: Decimal128,
      required: true,
      validate: { validator: validateQuantityField('availableQuantity') },
    },
    quantityUnit: { type: String, required: true, enum: QUANTITY_UNITS },
    availableUntil: { type: Date, required: true },
    foodExpiryAt: { type: Date },
    preparedAt: { type: Date },
    packedAt: { type: Date },
    organization: { type: ObjectId, ref: 'Organization', required: true },
    status: { type: String, required: true, enum: ['Available'], default: 'Available' },
  },
  { timestamps: true },
);

donationSchema.pre('validate', function validateAvailableQuantity(next) {
  if (
    this.quantity == null ||
    this.availableQuantity == null ||
    !this.quantityUnit ||
    !QUANTITY_UNITS.includes(this.quantityUnit)
  ) {
    return next();
  }

  try {
    const total = parseQuantity(this.quantity, this.quantityUnit, 'quantity');
    const available = parseQuantity(this.availableQuantity, this.quantityUnit, 'availableQuantity');
    if (compareQuantities(available, total) > 0) {
      this.invalidate('availableQuantity', 'availableQuantity must not exceed quantity');
    }
  } catch {
    // Path validators report field-level parsing errors on quantity or availableQuantity
  }

  return next();
});

donationSchema.statics.publicEligibilityFilter = function publicEligibilityFilter(serverNow = new Date()) {
  if (!(serverNow instanceof Date) || Number.isNaN(serverNow.getTime())) {
    throw new TypeError('serverNow must be a valid Date');
  }

  return {
    status: 'Available',
    availableUntil: { $gt: serverNow },
    availableQuantity: { $gt: mongoose.Types.Decimal128.fromString('0') },
  };
};

donationSchema.index({ status: 1, availableUntil: 1, createdAt: -1, _id: 1 });
donationSchema.index({ category: 1, status: 1, availableUntil: 1, createdAt: -1, _id: 1 });
donationSchema.index({ title: 'text', description: 'text' });

const Donation = mongoose.models.Donation ?? mongoose.model('Donation', donationSchema);

export default Donation;
