# Development Log

This log follows the approved phases in [the development roadmap](docs/architecture/DEVELOPMENT_ROADMAP.md). Completed foundation work is separated from planned product functionality.

## Phase 0 — Architecture consolidation (completed)

- Reviewed the project scaffold and documented product requirements, system/frontend/backend architecture, database design, API contracts, security, visual direction, roadmap and testing strategy.
- Recorded approved product decisions and unresolved policy inputs in `PROJECT_STATUS.md` and the architecture documents.

## Phase 1 — Design system and application shell (completed)

- Implemented the React/Vite public shell, React Router routes, landing page, not-found page, responsive navigation and footer.
- Added reusable UI components, Tailwind design tokens, accessibility foundations and the Axios API health-status display.
- Project owner reviewed desktop, tablet and mobile layouts and checked the backend health endpoint with the frontend Axios integration.
- Frontend production build passed. Frontend automated tests/lint are not configured.
- Backend health tests still need verification in a normal local environment because the audit sandbox encountered `EACCES` while binding a local port; DNS and CORS tests passed in that audit run.

## Phase 2 — Public Experience & Real Donation Discovery (scope finalized; M1 in progress)

M0 owner decisions are finalized and recorded in [Project status](PROJECT_STATUS.md). The scope calls for Donation and minimal Organization models, public MongoDB-backed listing/detail APIs, token-based title/description search, the seven approved food categories, pagination and deterministic sorting, the exact public DTO allowlist, responsive discovery pages, and backend/frontend automated tests. A development-only idempotent seed will provide approximately 15–20 demo records. Phase 2 excludes authentication, verification, donor publishing, claims, reservation, pickup scheduling, admin dashboards, location discovery, uploads, Socket.IO notifications and real-activity impact analytics.

### M1 — Shared categories and core data models (implementation present; acceptance incomplete)

- Added the canonical ESM donation categories, minimal Organization and Donation models, Decimal128 quantity utilities, and isolated Jest coverage. No external database or memory-server binary was used.
- Focused model, quantity and category tests passed. The full backend run passed five suites, but existing loopback health tests failed with environment `EACCES` socket-bind errors.
- Vite 5.4.21 production build and a production-bundler check of the shared module passed. No dependencies or package files changed.
- M1 remains in progress until full-suite verification can pass in an environment that permits the existing health test server to bind loopback.

### M2 — Database Indexes & Development Seed (completed)

- Added compound and text indexes to `Donation.js`:
  - `{ status: 1, availableUntil: 1, createdAt: -1, _id: 1 }` (feed browse)
  - `{ category: 1, status: 1, availableUntil: 1, createdAt: -1, _id: 1 }` (category browse)
  - `{ title: 'text', description: 'text' }` (keyword search)
- Evaluated compound index sort semantics: confirmed that leading equalities lock the partition and subsequent keys match the approved multi-key sort `{ availableUntil: 1, createdAt: -1, _id: 1 }` without an in-memory `SORT` stage.
- Implemented development seed engine in `backend/scripts/`:
  - `seedData.js`: 4 organizations and 18 demo donations with deterministic fixed IDs, valid future dates (2028), covering all 7 approved categories and 6 quantity units.
  - `seedRunner.js`: Idempotent insert-only upsert engine with normalized payload comparison (Decimal128, ObjectId, Date timestamps, scalar strings), `SeedCollisionError` on mismatch, zero deletions, and `E11000` duplicate-key race recovery.
  - `seed.js`: Safe CLI entry point with dynamic imports and pre-import synchronous production guard (`NODE_ENV === 'production'`).
  - Added `"seed": "node scripts/seed.js"` to `backend/package.json`.
- Added comprehensive automated tests:
  - `backend/tests/indexes.test.js`: Verified schema index declarations and `explain('executionStats')` query plans against an isolated in-memory MongoDB instance; verified `IXSCAN` usage, exact index names, and absence of in-memory `SORT` stages.
  - `backend/tests/seed.test.js`: Verified synchronous production guard blocking, manifest integrity, first-run insertions, second-run idempotency (0 inserted, 0 deleted, all skipped), collision detection without overwriting, and preservation of pre-existing unrelated documents.
- All 13 tests across `indexes.test.js` and `seed.test.js` passed (along with all 44 existing model, quantity, category, CORS, and DNS unit tests). Production guard verified via CLI. Documented schema in `DATABASE_SCHEMA.md`.

## Later phases — planned

- **Phase 3 and later:** Authentication/registration/verification, donor publishing, claims, pickup scheduling, admin workflows, location discovery, realtime delivery and other product activity remain outside Phase 2. Their requirements and sequencing need owner review before those phases are implemented.

See the [roadmap](docs/architecture/DEVELOPMENT_ROADMAP.md) for exit criteria and dependencies. Remaining boundaries are the future Donation lifecycle (intentionally undefined), food-safety/handling policy, and index validation by query plans. Planned work is not implemented functionality.
