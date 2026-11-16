// Synchronous check before any dynamic imports or DB connection attempts
if (process.env.NODE_ENV === 'production') {
  console.error('❌ SEED_ABORTED: Seeding is strictly prohibited in production environment (NODE_ENV=production).');
  process.exit(1);
}

async function main() {
  const { assertDevEnvironment, runSeed } = await import('./seedRunner.js');
  const { env } = await import('../src/config/env.js');

  // Defense-in-depth check using validated env
  assertDevEnvironment(env);

  const { connectDB } = await import('../src/config/db.js');
  await connectDB();

  console.log('🌱 Starting idempotent development seed...');
  const results = await runSeed();
  console.log('✅ Seed completed successfully:');
  console.table(results);

  const mongoose = (await import('mongoose')).default;
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
