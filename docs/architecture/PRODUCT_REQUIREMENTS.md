# FoodSurplus Product Requirements

## Product summary and implementation status

FoodSurplus connects food donors with NGOs and charitable organizations to redistribute surplus food. The repository implements the Phase 1 public frontend foundation and API health endpoint, plus M1 shared categories, core models, quantity utilities and focused tests. Phase 2 routes, pages and seed remain unimplemented.

## Phase 2 — Public Experience & Real Donation Discovery

### Included

- MongoDB-backed Donation records and the minimal Organization model described in [Database design](DATABASE_DESIGN.md).
- Public donation listing and detail APIs, plus responsive listing and detail pages.
- Search, category filtering, pagination and deterministic sorting.
- Privacy-safe public DTOs, backend and frontend automated tests, and a development-only seed of approximately 15–20 realistic demo donations.
- One controlled set of exactly seven food categories: **Prepared Meals**, **Fruits & Vegetables**, **Bakery**, **Dairy Products**, **Packaged Food**, **Grains & Staples**, and **Other**. These describe food, not donor organization types.

### Excluded

Authentication and registration; organization verification; donor publishing; claim submission or approval; quantity reservation; pickup scheduling; admin dashboards; location-based discovery; image uploads or Cloudinary; Socket.IO notifications; and impact analytics based on real platform activity. Seed records are demo data and must not be presented as real donor activity.

Phase 3 may add authentication, registration and verification, and may extend Organization. It is not part of Phase 2. Later product workflows remain subject to their respective roadmap scope and unresolved policy decisions.

## Donation discovery requirements

- The only Phase 2 public Organization field is `Organization.name`. The Phase 2 `Organization.type` field is an unrestricted string; do not add an enum or treat food categories as Organization types.
- Quantity units are `kg`, `g`, `L`, `mL`, `servings`, and `packets`. Permitted precision is kg up to 3 decimals, g whole numbers, L up to 3 decimals, mL whole numbers, servings up to 2 decimals, and packets whole numbers by default; fractional packets are allowed only for meaningful partial packets. Quantities are exact decimals, API quantities are decimal strings, values must be valid and positive, and `availableQuantity` cannot exceed `quantity`. No maximum donation quantity is defined.
- `availableUntil` is the canonical collection deadline. `foodExpiryAt` is a distinct optional food-expiry timestamp. `preparedAt` and `packedAt` are optional timestamps. Do not use `pickupDeadline` as a competing field.
- Publicly discoverable records must have `status === "Available"`, `availableUntil` later than server time, and `availableQuantity` greater than zero. Missing details, expired records and unavailable records return the same generic unavailable/not-found response and do not reveal private history. The full future Donation lifecycle is undefined.
- Public timestamps are consistently serialized as ISO 8601 UTC instants. The browser displays dates in the user's local timezone; browser time never controls eligibility.
- The exact public Donation DTO allowlist is `id`, `title`, `description`, `category`, `quantity`, `availableQuantity`, `quantityUnit`, `availableUntil`, optional `foodExpiryAt`, optional `preparedAt`, optional `packedAt`, and nested Organization `name` only. Never serialize raw documents.
- Public output excludes exact pickup address and coordinates, private contacts, pickup instructions, verification evidence, moderation data and internal claim/state information. No location-based discovery or approximate location is included until public-location precision receives explicit approval.
- Search uses MongoDB token-based text search over `title` and `description`; it is not arbitrary substring matching. Category is limited to the seven approved values.
- The initial listing API has no availability query parameter. Availability eligibility is applied by the server.

## Phase 2 API contract

Base path: `/api/v1/donations`.

`GET /api/v1/donations` supports `page` (default 1), `limit` (default 12, maximum 50), optional `search`, optional `category`, and `sort` (default `soonest`). The default order is `availableUntil` ascending, `createdAt` descending, then `_id` ascending. Pagination metadata includes `page`, `limit`, `totalItems`, `totalPages`, `hasNextPage`, and `hasPreviousPage`.

`GET /api/v1/donations/:id` returns a public donation detail only when it meets public availability rules. Success business responses use `{ success: true, data: ... }`. Errors use `{ success: false, error: { code, message, details } }`. Preserve the existing health endpoint response shape. See the [API specification](API_SPECIFICATION.md).

## M0 decisions and remaining boundaries

M0 owner decisions for categories, Organization public name/type, quantity units and precision, status eligibility, date handling, public DTO, and the donation error envelope are finalized in [Project status](../../PROJECT_STATUS.md). The complete future Donation lifecycle remains undefined. Launch-jurisdiction food-safety/eligibility policy and food-handling requirements remain pending. Candidate indexes still require query-plan validation. Location discovery is outside Phase 2; location precision is not a Phase 2 implementation dependency.

## Current versus planned

**Implemented foundation:** React/Vite public shell, shared Axios client, Express health route, MongoDB connection setup, security middleware and starter backend tests. Consult [Project status](../../PROJECT_STATUS.md) for the current snapshot.

**Planned for remaining Phase 2:** public list/detail APIs and pages, development-only seed, filtering/search/pagination, privacy-safe DTOs and further backend/frontend automated tests. M1 models and utility tests have been implemented; milestone acceptance is still in progress.
