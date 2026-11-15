# FoodSurplus Testing Strategy

## Current test setup

Backend uses Jest, Supertest and has mongodb-memory-server available. Current starter tests cover health/404, CORS and the development DNS gate; domain tests do not exist. Frontend automated testing is not configured. This document describes Phase 2 test plans, not completed coverage.

## Phase 2 backend tests

- Validate list query defaults and bounds: page 1, limit 12, maximum 50; reject malformed values, unsupported categories/sorts and Mongo operator injection.
- Verify token-based MongoDB text search covers title/description and is not arbitrary substring matching.
- Verify category filtering uses only the seven approved food categories.
- Verify deterministic ordering: `availableUntil` ascending, `createdAt` descending, `_id` ascending.
- Verify metadata: `page`, `limit`, `totalItems`, `totalPages`, `hasNextPage`, `hasPreviousPage`.
- Verify public eligibility requires Available status, future `availableUntil`, and positive `availableQuantity`; ensure unavailable, expired and missing details have generic responses without private historical information.
- Verify the exact DTO allowlist: approved donation fields and nested Organization `name` only; exclude Donation status, Organization IDs/type/timestamps, exact addresses/coordinates, private contacts, pickup instructions, verification evidence, moderation data and internal claim/state data.
- Test Decimal128 quantities, decimal-string API values, unit-specific precision, positive/finite values and `availableQuantity <= quantity`; reject malformed and out-of-range values.
- Preserve the exact health response and unrelated unknown-route behavior; validate Donation error codes/envelopes with `details: null` and production redaction.
- Validate the seed is development-only, idempotent, production-blocked, never invoked by server startup, covers all categories, uses valid Organization references and does not delete unrelated records.

## Phase 2 frontend tests

Recommended frontend test stack: Vitest 3.2.4, React Testing Library 16.3.0, `@testing-library/user-event` 14.6.1, `@testing-library/dom` 10.4.2, and jsdom 26.1.0. These are compatibility candidates, not installed dependencies. The lockfile resolves Vite 5.4.21; verify the resolved versions and peer ranges when implementation is authorized.

Test listing/detail loading, error, empty and success states; search/category/pagination/sort interactions; rendering public DTO fields without private data; keyboard and accessible control behavior; and responsive-relevant interaction states. Confirm API errors do not silently fall back to fixtures.

## Test tooling and execution

Backend target: Jest, Supertest and mongodb-memory-server. Use an isolated in-memory URI, set test environment values before importing config-dependent modules, never import the live server entry point, clear only the in-memory test database, and disconnect/stop the server in teardown. Frontend target versions above are recommendations only. M1 focused category/model/quantity tests were added without database connections. The full backend suite had loopback `EACCES` failures in the current environment; see [Project status](../../PROJECT_STATUS.md). Do not connect tests to a developer/shared Atlas database.

## Later-phase coverage boundary

Authentication, authorization, claims, transactions, uploads, verification, pickups, notifications, maps and moderation are outside Phase 2. Do not make these workflows the Phase 2 test plan. Define suitable security and business tests when those later scopes are approved.

## Current gaps

Donation and Organization models plus focused M1 tests now exist. Donation routes, discovery UI and seed do not. Candidate indexes have no query-plan evidence yet. M0 decisions are finalized; M1 acceptance remains in progress. Do not claim planned coverage or unverified query plans as completed.
