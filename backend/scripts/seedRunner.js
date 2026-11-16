import Organization from '../src/models/Organization.js';
import Donation from '../src/models/Donation.js';
import { compareQuantities } from '../src/utils/quantity.js';
import { SEED_ORGANIZATIONS, SEED_DONATIONS } from './seedData.js';

export class SeedCollisionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SeedCollisionError';
  }
}

export function assertDevEnvironment(currentEnv = process.env) {
  if (currentEnv.NODE_ENV === 'production') {
    throw new Error('SEED_ABORTED: Seeding is strictly prohibited in production environment (NODE_ENV=production).');
  }
}

function normalizeObjectId(id) {
  if (!id) return '';
  return (id._id ? id._id.toString() : id.toString()).toLowerCase();
}

function normalizeTimestamp(value) {
  if (value == null) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

export function matchesOrganization(existing, expected) {
  if (!existing || !expected) return false;
  return existing.name === expected.name && existing.type === expected.type;
}

export function matchesDonation(existing, expected) {
  if (!existing || !expected) return false;

  if (existing.title !== expected.title) return false;
  if (existing.description !== expected.description) return false;
  if (existing.category !== expected.category) return false;
  if (existing.quantityUnit !== expected.quantityUnit) return false;
  if (existing.status !== (expected.status ?? 'Available')) return false;

  // Normalized canonical hexadecimal ObjectId comparison
  if (normalizeObjectId(existing.organization) !== normalizeObjectId(expected.organization)) {
    return false;
  }

  // Exact decimal comparison via compareQuantities
  try {
    if (compareQuantities(existing.quantity, expected.quantity) !== 0) return false;
    if (compareQuantities(existing.availableQuantity, expected.availableQuantity) !== 0) return false;
  } catch {
    return false;
  }

  // Timestamp normalized comparisons for required and optional dates
  if (normalizeTimestamp(existing.availableUntil) !== normalizeTimestamp(expected.availableUntil)) {
    return false;
  }
  if (normalizeTimestamp(existing.foodExpiryAt) !== normalizeTimestamp(expected.foodExpiryAt)) {
    return false;
  }
  if (normalizeTimestamp(existing.preparedAt) !== normalizeTimestamp(expected.preparedAt)) {
    return false;
  }
  if (normalizeTimestamp(existing.packedAt) !== normalizeTimestamp(expected.packedAt)) {
    return false;
  }

  return true;
}

export async function runSeed({ organizations = SEED_ORGANIZATIONS, donations = SEED_DONATIONS } = {}) {
  assertDevEnvironment();

  const results = {
    organizations: { inserted: 0, skipped: 0 },
    donations: { inserted: 0, skipped: 0 },
  };

  // 1. Process Organizations
  for (const expectedOrg of organizations) {
    const existing = await Organization.findById(expectedOrg._id).lean();
    if (!existing) {
      try {
        await Organization.create(expectedOrg);
        results.organizations.inserted += 1;
      } catch (err) {
        if (err.code === 11000) {
          const raced = await Organization.findById(expectedOrg._id).lean();
          if (raced && matchesOrganization(raced, expectedOrg)) {
            results.organizations.skipped += 1;
            continue;
          }
        }
        throw err;
      }
    } else if (matchesOrganization(existing, expectedOrg)) {
      results.organizations.skipped += 1;
    } else {
      throw new SeedCollisionError(
        `ID collision detected for Organization ID ${expectedOrg._id}: existing record differs from seed manifest.`
      );
    }
  }

  // 2. Process Donations
  for (const expectedDonation of donations) {
    const existing = await Donation.findById(expectedDonation._id).lean();
    if (!existing) {
      try {
        await Donation.create(expectedDonation);
        results.donations.inserted += 1;
      } catch (err) {
        if (err.code === 11000) {
          const raced = await Donation.findById(expectedDonation._id).lean();
          if (raced && matchesDonation(raced, expectedDonation)) {
            results.donations.skipped += 1;
            continue;
          }
        }
        throw err;
      }
    } else if (matchesDonation(existing, expectedDonation)) {
      results.donations.skipped += 1;
    } else {
      throw new SeedCollisionError(
        `ID collision detected for Donation ID ${expectedDonation._id}: existing record "${existing.title}" differs from seed manifest.`
      );
    }
  }

  return results;
}
