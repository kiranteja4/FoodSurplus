# FoodSurplus Authentication and Security Architecture

## Current implementation

The application foundation includes Helmet, configured CORS, body parsing limits, MongoDB sanitization, rate limiting, environment validation and centralized error handling. Authentication and product authorization are not implemented. Phase 2 adds public read-only discovery; authentication, registration and verification remain excluded.

## Phase 2 public API controls

- Validate query parameters and route identifiers with the established Zod convention. Allowlist supported filters and sort values; never pass client-controlled operators or arbitrary fields into MongoDB queries.
- Enforce positive bounded pagination (`page` default 1, `limit` default 12, maximum 50).
- Apply server-side public availability: status Available, `availableUntil` later than server time, and positive `availableQuantity`.
- Return the exact approved public Donation DTO allowlist; nested Organization output contains only `name`. Do not serialize whole Mongoose documents.
- Exclude exact pickup address/coordinates, private contacts, pickup instructions, verification evidence, internal moderation information and internal claim/state details.
- Return a generic unavailable/not-found response for missing, expired or unavailable donations without private history.
- Do not add location-based discovery or public location precision until approved.

## Phase 2 exclusions

No authentication, registration, RBAC, organization verification, donor publishing, claims, reservation, pickup scheduling, admin dashboards, uploads, Cloudinary or Socket.IO events are added in this phase. Later phases must implement backend authorization for private operations; frontend route checks alone are never sufficient.

## Decisions awaiting resolution

M0 decisions for public Organization name, quantity, date behavior, DTO and Donation error envelope are finalized in [Project status](../../PROJECT_STATUS.md). Use Decimal128 and decimal strings for quantities, and do not disclose Organization `type`, IDs or timestamps. Donation errors use the documented initial code mapping with `details: null`; format donation errors without changing health or unrelated-route responses. Food-safety/eligibility rules for the launch jurisdiction and required handling information remain pending. Approximate-location discovery is excluded from Phase 2.
