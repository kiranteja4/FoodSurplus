# FoodSurplus Project Status

## Current stage

Phase 1 public frontend foundation is completed. Phase 2 — Public Experience & Real Donation Discovery — has finalized scope and M0 decisions. M1 shared categories, core models and quantity utilities are implemented; M1 remains in progress because the complete backend suite could not pass its existing loopback health tests in this environment.

## Phase 2 scope

Phase 2 plans MongoDB-backed Donation records and a minimal Organization model; public listing/detail APIs; search, category filtering, bounded pagination and deterministic sorting; explicit public DTOs; responsive listing/detail pages; a development-only seed of approximately 15–20 demo donations; and backend/frontend automated tests.

Phase 2 excludes authentication/registration, organization verification, donor publishing, claims/approval, reservation, pickup scheduling, admin dashboards, location-based discovery, image uploads/Cloudinary, Socket.IO notifications and real-activity impact analytics. Phase 3 may extend Organization. None of these planned features is implemented.

## M0 decision register — finalized

| Area | Owner-approved decision |
|---|---|
| Food categories | Exactly Prepared Meals; Fruits & Vegetables; Bakery; Dairy Products; Packaged Food; Grains & Staples; Other. These are donated-food categories, not Organization types. |
| Organization | Minimal fields: `_id`, `name`, `type`, `createdAt`, `updatedAt`. `name` is the sole public Organization field. `type` is an unrestricted string in Phase 2; do not add an enum. Other Organization fields remain private. |
| Quantity | Units are kg, g, L, mL, servings, packets. Approved precision: kg up to 3 decimals; g whole; L up to 3 decimals; mL whole; servings up to 2 decimals; packets whole by default, with fractions only for meaningful partial packets. Use Decimal128, accept/validate decimal strings, and serialize quantities as strings. Reject zero, negative, non-finite, malformed and out-of-range values. `availableQuantity` must not exceed `quantity`. No maximum donation quantity is defined. |
| Public status | Only `Available` is defined for Phase 2 discovery. Do not define the future status lifecycle. Eligibility is status Available, `availableUntil` later than server time, and `availableQuantity` greater than zero. Server time controls eligibility. |
| Dates | Store UTC instants, serialize API timestamps consistently as ISO 8601 UTC, and display dates in the browser's local timezone. `availableUntil` is canonical; `foodExpiryAt` is separate and optional; `preparedAt` and `packedAt` are optional. Do not use `pickupDeadline` or apply food expiry as another eligibility rule without food-safety policy. |
| Public Donation DTO | Exact allowlist: `id`, `title`, `description`, `category`, `quantity`, `availableQuantity`, `quantityUnit`, `availableUntil`, and optional `foodExpiryAt`, `preparedAt`, `packedAt`; nested Organization includes `name` only. Exclude status, Organization IDs/type/timestamps, exact location, contacts, pickup instructions, verification evidence, moderation information and internal claim/state fields. Never serialize whole Mongoose documents. |
| Donation errors | Use `{ success: false, error: { code, message, details } }`. Validation errors use `VALIDATION_ERROR`, message `Invalid request`, and `details: null`. Keep details null for public donation errors unless the contract is explicitly revised. Preserve health and unrelated-route responses. Do not expose stacks or internal database messages. |

## Technical recommendations and verification state

- Use `shared/donationCategories.mjs` as the single category source. Configure Vite access for only the frontend root and shared directory.
- Represent quantity values as Decimal128 and wire values as decimal strings. These match the owner-approved precision and serialization decisions.
- For packets, M1 permits any positive Decimal128-representable fractional value because no universal fractional scale was approved. Whether a partial packet is meaningful must be judged when a future input workflow has product context; no model heuristic is invented.
- Seed with stable fixed IDs, insert-only upserts, collision checks, a production guard before database connection, no deletion, and no startup invocation.
- Keep candidate indexes provisional until representative query-plan evidence is available.
- Frontend test candidates are Vitest 3.2.4, React Testing Library 16.3.0, user-event 14.6.1, DOM Testing Library 10.4.2, and jsdom 26.1.0. These are recommendations, not installed dependencies.
- Backend tests use Jest, Supertest and mongodb-memory-server. Tests must connect only to an isolated in-memory database and close the connection/server during teardown.
- M1 model and utility tests pass. The full backend suite's existing health tests could not bind loopback sockets (`EACCES`) in this environment. The frontend production build and shared-module bundling pass. No index query plan, seed behavior, API or discovery UI has been implemented or verified.

## Remaining policy boundary

The complete future Donation status lifecycle remains intentionally undefined. Food-safety/eligibility policy for the launch jurisdiction and food-handling requirements remain pending. Location discovery is excluded from Phase 2; public location precision is not needed to start this phase. Final index definitions remain unverified until query-plan validation.

## Implemented foundation

The frontend has React/Vite with BrowserRouter/AppRoutes, responsive PublicLayout, SiteHeader/SiteFooter, LandingPage and NotFoundPage; reusable Button, Container, SectionHeading and ApiHealthStatus components; Tailwind design tokens/global styles; and a shared Axios health request. Backend foundation includes the Express health endpoint, MongoDB connection, environment validation, Helmet, CORS, request parsing, NoSQL sanitization and rate limiting, plus Socket.IO server initialization. Starter backend health/CORS/DNS tests are present.

Organization and Donation models, shared categories, quantity utilities, and focused M1 tests now exist. Donation APIs, discovery pages, seed scripts and later domain workflows do not. Architecture documents describe target behavior except where this status records implemented M1 work. See [API documentation](API_DOCUMENTATION.md) for current API behavior.

## Phase 1 validation record

The owner-reviewed desktop, tablet and mobile visuals; the health endpoint and frontend Axios integration were checked; and the frontend production build passed, as recorded in the existing project log. Backend health tests still require verification in a normal local environment after the audit sandbox encountered EACCES binding a local port. This documentation update did not rerun those checks.

## Documentation map

Architecture documents cover product requirements, system, frontend, backend, database design, planned API, authentication/security, UI design, roadmap and testing. The README and Development Log provide repository and progress context. M0 is finalized; M1 implementation is present but not yet accepted as complete.
