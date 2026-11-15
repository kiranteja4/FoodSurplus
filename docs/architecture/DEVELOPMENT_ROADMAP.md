# FoodSurplus Development Roadmap

This roadmap separates implemented foundation work from finalized but not yet implemented Phase 2 scope. See [Product requirements](PRODUCT_REQUIREMENTS.md) for the canonical requirements. No planned feature should be reported as live until implemented and verified.

## Phase 0 — Architecture consolidation (completed)

- Audit the scaffold and document product, system, frontend/backend, database, API, security, design, testing and roadmap direction.

## Phase 1 — Design system and application shell (completed)

- Deliver the public shell, landing and not-found pages, responsive navigation, reusable baseline UI, design tokens and health-status integration.
- Existing health route and API integration were checked; the frontend production build passed as recorded in `PROJECT_STATUS.md`.

## M0 — Technical prerequisites and owner decisions (complete)

- Owner decisions for categories, Organization name/type, quantities, status eligibility, dates, public Donation DTO and error envelope are finalized in [Project status](../../PROJECT_STATUS.md).
- Technical recommendations are recorded there; they are not claims that implementation, test tooling or database queries exist.

## Phase 2 — Public Experience & Real Donation Discovery (finalized scope; implementation pending)

- Add MongoDB-backed Donation records and a minimal Organization model containing `_id`, public `name`, unrestricted string `type`, `createdAt` and `updatedAt`. Only Organization `name` is public.
- Use the one shared category module `shared/donationCategories.mjs` for frontend options, backend validation, model values and seed records.
- Store `quantity` and `availableQuantity` as Decimal128, validate the owner-approved precision by `quantityUnit`, accept decimal strings at the API boundary, and return decimal strings. Enforce `availableQuantity <= quantity`; no maximum quantity is defined.
- Implement public listing/detail APIs and responsive frontend pages. Listing supports `page` (default 1), `limit` (default 12, max 50), optional `search`, optional `category`, and `sort` (default `soonest`); no availability parameter.
- Use token-based MongoDB text search over `title` and `description`, exactly seven approved food categories, and deterministic order by `availableUntil` ascending, `createdAt` descending, then `_id` ascending.
- Discover only Available records with future `availableUntil` and positive `availableQuantity`. Use generic unavailable/not-found behavior for unavailable, expired or missing details.
- Return this exact public DTO allowlist: `id`, `title`, `description`, `category`, `quantity`, `availableQuantity`, `quantityUnit`, `availableUntil`, optional `foodExpiryAt`, optional `preparedAt`, optional `packedAt`, and nested Organization `name` only. Never serialize whole documents. Omit status, Organization IDs/type/timestamps, exact address/coordinates, private contacts, pickup instructions, verification evidence, moderation details and internal claim/state data.
- Store UTC instants, serialize timestamps consistently as ISO 8601 UTC strings, and display dates in the browser's local timezone. Server time alone controls eligibility; food expiry is not an additional availability rule without food-safety policy.
- Donation errors use the initial mapping and `details: null` convention in [API specification](API_SPECIFICATION.md), while preserving health and unrelated-route behavior.
- Add a development-only idempotent seed with approximately 15–20 realistic records, valid Organization references and all seven categories. Production execution is blocked; startup never runs it; unrelated records are never deleted.
- Build backend tests using Jest, Supertest and mongodb-memory-server, plus frontend tests using Vitest, React Testing Library and `@testing-library/user-event`. Existing Vite is 5.4.21, so select a compatible Vitest 3.x version. Do not install packages without approval.
- Candidate indexes (`status + availableUntil`, `category + status + availableUntil`, text on `title + description`) require query-plan validation before final definitions.
- Explicitly excluded: authentication/registration, verification, donor publishing, claims/approval, quantity reservation, pickup scheduling, admin dashboards, location discovery, uploads/Cloudinary, Socket.IO notifications and real-activity impact analytics.
- Exit: APIs and pages use persisted records; availability, filters, pagination, sorting and privacy are covered by automated tests; owner reviews the result. No claim that Phase 2 is complete before that point.

## Phase 3 — Authentication and organization workflows (future)

May add authentication, registration, verification and extend Organization. Scope, authorization and policy details must be defined before implementation. Do not pull these into Phase 2.

## Later product phases

Donor publishing, claims, pickups, admin workflows, location-based discovery, realtime notifications and analytics are later work. Their sequencing and requirements must be reconciled with Phase 2 outcomes and owner decisions before implementation; this document does not authorize expanding Phase 2.

## Remaining boundaries and verification

- The future Donation status lifecycle remains intentionally undefined beyond Phase 2's Available status.
- Food-safety/eligibility policy for the launch jurisdiction and food-handling requirements remain pending.
- Candidate indexes remain unfinalized until query-plan evidence is available.
- No location discovery is included in Phase 2, so approximate-location precision is not a Phase 2 prerequisite.
- M0 is complete. M1 implementation is present, but milestone acceptance remains incomplete because existing loopback health tests failed with `EACCES` in the current environment. See [Project status](../../PROJECT_STATUS.md) for verified checks.
