import mongoose from 'mongoose';
import Donation from '../src/models/Donation.js';
import Organization from '../src/models/Organization.js';
import { DONATION_CATEGORIES } from '../../shared/donationCategories.mjs';

const organizationId = new mongoose.Types.ObjectId();

function validDonation(overrides = {}) {
  return new Donation({
    title: 'Prepared food surplus',
    description: 'Freshly prepared food available for collection.',
    category: 'Prepared Meals',
    quantity: '12.500',
    availableQuantity: '10.250',
    quantityUnit: 'kg',
    availableUntil: new Date('2030-01-01T12:00:00.000Z'),
    organization: organizationId,
    ...overrides,
  });
}

describe('Organization model', () => {
  it('validates a name and unrestricted string type, and enables timestamps', async () => {
    const organization = new Organization({ name: 'Community Kitchen', type: 'Community kitchen partner' });
    await expect(organization.validate()).resolves.toBeUndefined();
    expect(organization.schema.options.timestamps).toBe(true);
    expect(organization.type).toBe('Community kitchen partner');
    expect(Organization.schema.path('type').instance).toBe('String');
    expect(Organization.schema.path('type').options.enum).toBeUndefined();
  });

  it('rejects a missing or blank name', async () => {
    await expect(new Organization({ type: 'Any type' }).validate()).rejects.toThrow(/name/);
    await expect(new Organization({ name: '   ', type: 'Any type' }).validate()).rejects.toThrow(/name/);
  });
});

describe('Donation model', () => {
  it('validates a document, optional dates, ObjectId reference and Available default', async () => {
    const donation = validDonation();
    await expect(donation.validate()).resolves.toBeUndefined();
    expect(donation.status).toBe('Available');
    expect(donation.organization).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(donation.foodExpiryAt).toBeUndefined();
    expect(donation.preparedAt).toBeUndefined();
    expect(donation.packedAt).toBeUndefined();
    expect(donation.schema.options.timestamps).toBe(true);
    expect(donation.quantity).toBeInstanceOf(mongoose.Types.Decimal128);
  });

  it('requires the core donation fields and organization reference', async () => {
    const error = await new Donation().validate().catch((validationError) => validationError);
    for (const field of ['title', 'description', 'category', 'quantity', 'availableQuantity', 'quantityUnit', 'availableUntil', 'organization']) {
      expect(error.errors[field]).toBeDefined();
    }
  });

  it('accepts every approved category and rejects unsupported categories', async () => {
    for (const category of DONATION_CATEGORIES) {
      await expect(validDonation({ category }).validate()).resolves.toBeUndefined();
    }
    await expect(validDonation({ category: 'NGO' }).validate()).rejects.toThrow(/category/);
  });

  it('rejects unsupported units, invalid quantities and unit-specific precision on quantity path', async () => {
    await expect(validDonation({ quantityUnit: 'boxes' }).validate()).rejects.toThrow(/quantityUnit/);

    for (const invalidQuantity of ['0', '-1', '1.2345']) {
      const error = await validDonation({ quantity: invalidQuantity, availableQuantity: '1' })
        .validate()
        .catch((validationError) => validationError);
      expect(error.errors.quantity).toBeDefined();
      expect(error.errors.availableQuantity).toBeUndefined();
    }

    const gError = await validDonation({ quantityUnit: 'g', quantity: '2.5', availableQuantity: '2' })
      .validate()
      .catch((validationError) => validationError);
    expect(gError.errors.quantity).toBeDefined();
    expect(gError.errors.availableQuantity).toBeUndefined();

    const servingsError = await validDonation({ quantityUnit: 'servings', quantity: '2.001', availableQuantity: '2' })
      .validate()
      .catch((validationError) => validationError);
    expect(servingsError.errors.quantity).toBeDefined();
    expect(servingsError.errors.availableQuantity).toBeUndefined();
  });

  it('rejects invalid available quantities attributing error to availableQuantity only', async () => {
    for (const invalidAvailable of ['0', '-1', '1.2345']) {
      const error = await validDonation({ quantity: '10', availableQuantity: invalidAvailable })
        .validate()
        .catch((validationError) => validationError);
      expect(error.errors.availableQuantity).toBeDefined();
      expect(error.errors.quantity).toBeUndefined();
    }
  });

  it('rejects available quantity greater than total and permits a fractional packet and leading decimals', async () => {
    const exceedsError = await validDonation({ quantity: '2', availableQuantity: '2.001' })
      .validate()
      .catch((validationError) => validationError);
    expect(exceedsError.errors.availableQuantity).toBeDefined();
    expect(exceedsError.errors.availableQuantity.message).toMatch(/availableQuantity must not exceed quantity/);
    expect(exceedsError.errors.quantity).toBeUndefined();

    await expect(validDonation({ quantity: '2', availableQuantity: '0.25', quantityUnit: 'packets' }).validate()).resolves.toBeUndefined();
    await expect(validDonation({ quantity: '.5', availableQuantity: '.25', quantityUnit: 'kg' }).validate()).resolves.toBeUndefined();
  });

  it('validates date types, keeps optional dates optional and does not require availability to be future', async () => {
    await expect(validDonation({ availableUntil: 'not a date' }).validate()).rejects.toThrow(/availableUntil/);
    await expect(validDonation({ availableUntil: new Date('2000-01-01T00:00:00.000Z') }).validate()).resolves.toBeUndefined();
    await expect(validDonation({ foodExpiryAt: 'not a date' }).validate()).rejects.toThrow(/foodExpiryAt/);
  });

  it('defines only the approved Available status and creates a server-time eligibility filter', () => {
    const now = new Date('2030-01-01T00:00:00.000Z');
    expect(Donation.schema.path('status').options.enum).toEqual(['Available']);
    expect(validDonation({ status: 'Claimed' }).validateSync().errors.status).toBeDefined();
    expect(Donation.publicEligibilityFilter(now)).toEqual({
      status: 'Available',
      availableUntil: { $gt: now },
      availableQuantity: { $gt: mongoose.Types.Decimal128.fromString('0') },
    });
    expect(() => Donation.publicEligibilityFilter(new Date('invalid'))).toThrow(/valid Date/);
  });
});
