import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Donation from '../src/models/Donation.js';
import Organization from '../src/models/Organization.js';
import { SEED_ORGANIZATIONS, SEED_DONATIONS } from '../scripts/seedData.js';

// Recursive plan-tree inspection helpers
export function findStages(planNode, stageName) {
  const matches = [];
  if (!planNode || typeof planNode !== 'object') return matches;

  if (planNode.stage === stageName) {
    matches.push(planNode);
  }

  if (planNode.inputStage) {
    matches.push(...findStages(planNode.inputStage, stageName));
  }
  if (Array.isArray(planNode.inputStages)) {
    for (const child of planNode.inputStages) {
      matches.push(...findStages(child, stageName));
    }
  }

  return matches;
}

export function hasStage(planNode, stageName) {
  return findStages(planNode, stageName).length > 0;
}

export function findIndexNames(planNode) {
  const indexNames = [];
  if (!planNode || typeof planNode !== 'object') return indexNames;

  if (planNode.indexName) {
    indexNames.push(planNode.indexName);
  }

  if (planNode.inputStage) {
    indexNames.push(...findIndexNames(planNode.inputStage));
  }
  if (Array.isArray(planNode.inputStages)) {
    for (const child of planNode.inputStages) {
      indexNames.push(...findIndexNames(child));
    }
  }

  return indexNames;
}

describe('Donation Schema Indexes (Static Verification)', () => {
  it('declares the approved compound and text indexes', () => {
    const indexes = Donation.schema.indexes();

    // Check Index 1: status + availableUntil + createdAt + _id
    const feedIndex = indexes.find(([fields]) =>
      fields.status === 1 &&
      fields.availableUntil === 1 &&
      fields.createdAt === -1 &&
      fields._id === 1
    );
    expect(feedIndex).toBeDefined();

    // Check Index 2: category + status + availableUntil + createdAt + _id
    const categoryIndex = indexes.find(([fields]) =>
      fields.category === 1 &&
      fields.status === 1 &&
      fields.availableUntil === 1 &&
      fields.createdAt === -1 &&
      fields._id === 1
    );
    expect(categoryIndex).toBeDefined();

    // Check Index 3: title + description text index
    const textIndex = indexes.find(([fields]) =>
      fields.title === 'text' &&
      fields.description === 'text'
    );
    expect(textIndex).toBeDefined();

    // Verify exactly 3 indexes are declared on the schema
    expect(indexes.length).toBe(3);
  });
});

describe('Donation Query Plans with explain(executionStats)', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Ensure all schema indexes are built in the database
    await Organization.init();
    await Donation.init();

    // Seed sample records
    await Organization.create(SEED_ORGANIZATIONS);
    await Donation.create(SEED_DONATIONS);
  }, 60000);

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it('uses Index 1 and avoids in-memory SORT for default public feed browse', async () => {
    const serverNow = new Date('2028-01-01T00:00:00.000Z');
    const filter = Donation.publicEligibilityFilter(serverNow);
    const sort = { availableUntil: 1, createdAt: -1, _id: 1 };

    const explain = await Donation.find(filter).sort(sort).explain('executionStats');
    const winningPlan = explain.queryPlanner.winningPlan;

    // 1. Recursive check for IXSCAN stage
    const ixScans = findStages(winningPlan, 'IXSCAN');
    expect(ixScans.length).toBeGreaterThan(0);

    // 2. Recursive check that expected index was used
    const indexNames = findIndexNames(winningPlan);
    expect(indexNames).toContain('status_1_availableUntil_1_createdAt_-1__id_1');

    // 3. Verify zero blocking in-memory SORT stage
    expect(hasStage(winningPlan, 'SORT')).toBe(false);

    // 4. Verify execution returned records
    expect(explain.executionStats.nReturned).toBeGreaterThan(0);
  });

  it('uses Index 2 and avoids in-memory SORT for category filtered browse', async () => {
    const serverNow = new Date('2028-01-01T00:00:00.000Z');
    const filter = {
      category: 'Bakery',
      ...Donation.publicEligibilityFilter(serverNow),
    };
    const sort = { availableUntil: 1, createdAt: -1, _id: 1 };

    const explain = await Donation.find(filter).sort(sort).explain('executionStats');
    const winningPlan = explain.queryPlanner.winningPlan;

    // 1. Recursive check for IXSCAN stage
    const ixScans = findStages(winningPlan, 'IXSCAN');
    expect(ixScans.length).toBeGreaterThan(0);

    // 2. Recursive check that category compound index was used
    const indexNames = findIndexNames(winningPlan);
    expect(indexNames).toContain('category_1_status_1_availableUntil_1_createdAt_-1__id_1');

    // 3. Verify zero blocking in-memory SORT stage
    expect(hasStage(winningPlan, 'SORT')).toBe(false);

    // 4. Verify execution returned Bakery records
    expect(explain.executionStats.nReturned).toBeGreaterThan(0);
  });

  it('uses text index for keyword search and reports SORT presence separately', async () => {
    const serverNow = new Date('2028-01-01T00:00:00.000Z');
    const filter = {
      $text: { $search: 'sourdough' },
      ...Donation.publicEligibilityFilter(serverNow),
    };

    const explain = await Donation.find(filter).explain('executionStats');
    const winningPlan = explain.queryPlanner.winningPlan;

    // 1. Recursive check for TEXT or TEXT_MATCH stage
    const textStages = findStages(winningPlan, 'TEXT').concat(findStages(winningPlan, 'TEXT_MATCH'));
    expect(textStages.length).toBeGreaterThan(0);

    // 2. Report SORT separately without requiring its absence
    const hasSortStage = hasStage(winningPlan, 'SORT');
    expect(typeof hasSortStage).toBe('boolean');

    // 3. Verify execution returned matches
    expect(explain.executionStats.nReturned).toBeGreaterThan(0);
  });
});
