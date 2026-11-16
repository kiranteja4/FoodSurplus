import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Organization from '../src/models/Organization.js';
import Donation from '../src/models/Donation.js';
import { parseQuantity, validateQuantityPair } from '../src/utils/quantity.js';
import { DONATION_CATEGORIES } from '../../shared/donationCategories.mjs';
import { SEED_ORGANIZATIONS, SEED_DONATIONS } from '../scripts/seedData.js';
import {
  assertDevEnvironment,
  matchesOrganization,
  matchesDonation,
  runSeed,
  SeedCollisionError,
} from '../scripts/seedRunner.js';

describe('Seed Safety Guards & Manifest Validation', () => {
  it('blocks execution when NODE_ENV is production', () => {
    expect(() => assertDevEnvironment({ NODE_ENV: 'production' })).toThrow(/SEED_ABORTED/);
    expect(() => assertDevEnvironment({ NODE_ENV: 'development' })).not.toThrow();
    expect(() => assertDevEnvironment({ NODE_ENV: 'test' })).not.toThrow();
  });

  it('validates manifest size and organization integrity', () => {
    expect(SEED_ORGANIZATIONS.length).toBe(4);
    const orgIds = new Set();
    for (const org of SEED_ORGANIZATIONS) {
      expect(org._id).toBeInstanceOf(mongoose.Types.ObjectId);
      expect(typeof org.name).toBe('string');
      expect(org.name.trim().length).toBeGreaterThan(0);
      expect(typeof org.type).toBe('string');
      expect(org.type.trim().length).toBeGreaterThan(0);
      orgIds.add(org._id.toString());
    }
    expect(orgIds.size).toBe(SEED_ORGANIZATIONS.length);
  });

  it('contains 18 demo donations covering all seven categories and six quantity units', () => {
    // 15–20 requirement
    expect(SEED_DONATIONS.length).toBe(18);

    const categoriesFound = new Set();
    const unitsFound = new Set();
    const donationIds = new Set();
    const validOrgIds = new Set(SEED_ORGANIZATIONS.map((o) => o._id.toString()));

    for (const donation of SEED_DONATIONS) {
      donationIds.add(donation._id.toString());
      categoriesFound.add(donation.category);
      unitsFound.add(donation.quantityUnit);

      // Validate categories
      expect(DONATION_CATEGORIES).toContain(donation.category);

      // Validate quantities using quantity utility
      expect(() => {
        parseQuantity(donation.quantity, donation.quantityUnit, 'quantity');
        parseQuantity(donation.availableQuantity, donation.quantityUnit, 'availableQuantity');
        validateQuantityPair(donation.quantity, donation.availableQuantity, donation.quantityUnit);
      }).not.toThrow();

      // Validate dates
      expect(donation.availableUntil).toBeInstanceOf(Date);
      expect(Number.isNaN(donation.availableUntil.getTime())).toBe(false);
      expect(donation.availableUntil.getTime()).toBeGreaterThan(Date.now());

      // Validate organization reference
      expect(validOrgIds.has(donation.organization.toString())).toBe(true);

      // Validate status
      expect(donation.status).toBe('Available');
    }

    // All seven approved categories must be represented
    expect(categoriesFound.size).toBe(7);
    for (const category of DONATION_CATEGORIES) {
      expect(categoriesFound.has(category)).toBe(true);
    }

    // All six quantity units must be represented
    for (const unit of ['kg', 'g', 'L', 'mL', 'servings', 'packets']) {
      expect(unitsFound.has(unit)).toBe(true);
    }

    // Unique IDs
    expect(donationIds.size).toBe(SEED_DONATIONS.length);
  });

  it('matchesOrganization correctly compares fields and ignores extra properties', () => {
    const org = SEED_ORGANIZATIONS[0];
    expect(matchesOrganization({ name: org.name, type: org.type, __v: 0 }, org)).toBe(true);
    expect(matchesOrganization({ name: 'Different Name', type: org.type }, org)).toBe(false);
    expect(matchesOrganization({ name: org.name, type: 'Different Type' }, org)).toBe(false);
  });

  it('matchesDonation compares all persisted fields and detects any mismatch', () => {
    const item = SEED_DONATIONS[0];
    const existing = {
      title: item.title,
      description: item.description,
      category: item.category,
      quantityUnit: item.quantityUnit,
      organization: item.organization,
      status: item.status,
      quantity: item.quantity,
      availableQuantity: item.availableQuantity,
      availableUntil: new Date(item.availableUntil),
      preparedAt: item.preparedAt ? new Date(item.preparedAt) : undefined,
      foodExpiryAt: item.foodExpiryAt ? new Date(item.foodExpiryAt) : undefined,
      packedAt: item.packedAt ? new Date(item.packedAt) : undefined,
    };

    expect(matchesDonation(existing, item)).toBe(true);

    // Mismatched title
    expect(matchesDonation({ ...existing, title: 'Mutated' }, item)).toBe(false);
    // Mismatched description
    expect(matchesDonation({ ...existing, description: 'Mutated' }, item)).toBe(false);
    // Mismatched category
    expect(matchesDonation({ ...existing, category: 'Bakery' }, item)).toBe(false);
    // Mismatched quantity
    expect(matchesDonation({ ...existing, quantity: '999.00' }, item)).toBe(false);
    // Mismatched organization
    expect(matchesDonation({ ...existing, organization: new mongoose.Types.ObjectId() }, item)).toBe(false);
    // Mismatched date
    expect(matchesDonation({ ...existing, availableUntil: new Date('2099-01-01') }, item)).toBe(false);
  });
});

describe('Database Seeding Execution & Idempotency', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  }, 60000);

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it('successfully executes first run and inserts all organizations and donations', async () => {
    const res = await runSeed();

    expect(res.organizations.inserted).toBe(4);
    expect(res.organizations.skipped).toBe(0);
    expect(res.donations.inserted).toBe(18);
    expect(res.donations.skipped).toBe(0);

    const orgCount = await Organization.countDocuments();
    const donationCount = await Donation.countDocuments();
    expect(orgCount).toBe(4);
    expect(donationCount).toBe(18);
  });

  it('executes repeatedly without duplicate records or modifications (idempotency)', async () => {
    const res = await runSeed();

    expect(res.organizations.inserted).toBe(0);
    expect(res.organizations.skipped).toBe(4);
    expect(res.donations.inserted).toBe(0);
    expect(res.donations.skipped).toBe(18);

    const orgCount = await Organization.countDocuments();
    const donationCount = await Donation.countDocuments();
    expect(orgCount).toBe(4);
    expect(donationCount).toBe(18);
  });

  it('raises SeedCollisionError and does NOT overwrite or delete when conflicting record exists', async () => {
    const targetId = SEED_DONATIONS[0]._id;

    // Mutate the record in the database so it conflicts with the manifest
    await Donation.findByIdAndUpdate(targetId, { title: 'Conflicting Mutated Title' });

    await expect(runSeed()).rejects.toThrow(SeedCollisionError);

    // Verify the conflicting record is still in the database and was NOT overwritten by manifest
    const record = await Donation.findById(targetId);
    expect(record.title).toBe('Conflicting Mutated Title');

    // Restore original title for subsequent tests
    await Donation.findByIdAndUpdate(targetId, { title: SEED_DONATIONS[0].title });
  });

  it('preserves unrelated records in the database during seeding', async () => {
    // Insert an unrelated organization and donation
    const customOrg = await Organization.create({
      name: 'Unrelated Community Group',
      type: 'Independent NGO',
    });

    const customDonation = await Donation.create({
      title: 'Unrelated Food Tray',
      description: 'Preserved user food tray.',
      category: 'Prepared Meals',
      quantity: '5.000',
      availableQuantity: '5.000',
      quantityUnit: 'kg',
      availableUntil: new Date('2028-12-31T00:00:00.000Z'),
      organization: customOrg._id,
      status: 'Available',
    });

    // Run seeding again
    const res = await runSeed();
    expect(res.organizations.skipped).toBe(4);
    expect(res.donations.skipped).toBe(18);

    // Verify unrelated records remain completely intact
    const foundOrg = await Organization.findById(customOrg._id);
    const foundDonation = await Donation.findById(customDonation._id);
    expect(foundOrg).not.toBeNull();
    expect(foundOrg.name).toBe('Unrelated Community Group');
    expect(foundDonation).not.toBeNull();
    expect(foundDonation.title).toBe('Unrelated Food Tray');

    // Clean up custom records
    await Donation.findByIdAndDelete(customDonation._id);
    await Organization.findByIdAndDelete(customOrg._id);
  });
});
