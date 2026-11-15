# FoodSurplus Backend Architecture

## Current implementation

The backend is an ES-module Express application with existing top-level layers for config, routes, controllers, services, models, validators, middleware, sockets, jobs and utilities. The health route, middleware and MongoDB connection are implemented. M1 adds Organization and Donation schemas plus quantity utilities and focused model tests. Product routes, feature validators and seed scripts remain unimplemented.

## Phase 2 target structure

Add only the discovery pieces needed within the existing layers:

```text
src/
  routes/donation.routes.js
  controllers/donationController.js
  services/donationService.js
  models/Donation.js
  models/Organization.js
  validators/donationQuery.js
  middleware/ (existing centralized handling plus donation error formatting)
scripts/ (explicit development seed entry point; exact placement follows repository convention)
```

Keep route handlers declarative, validation in Zod schemas, query/business rules in services and persistence constraints in Mongoose. Do not add authentication, authorization workflows, claims, publishing, uploads, jobs or socket events as part of Phase 2.

## Public donation API

Base path: `/api/v1/donations`.

- `GET /` lists eligible records. Parameters: `page` default 1, `limit` default 12 and max 50, optional `search`, optional approved `category`, and `sort` default `soonest`. There is no availability parameter.
- `GET /:id` returns eligible public detail only.
- Eligibility requires Available status, `availableUntil > server time`, and `availableQuantity > 0`. Generic unavailable/not-found behavior applies to unavailable, expired or missing records.
- Search is MongoDB token-based text search over `title` and `description`, not substring matching.
- Default sort: `availableUntil` ascending, `createdAt` descending, `_id` ascending.
- Pagination metadata: `page`, `limit`, `totalItems`, `totalPages`, `hasNextPage`, `hasPreviousPage`.
- New business success/error responses follow `{ success: true, data: ... }` and `{ success: false, error: { code, message, details } }`. Keep health response compatibility.

## Validation and privacy

Validate route IDs and all supported query parameters; allowlist enum values and never pass client-controlled Mongo operators or arbitrary fields into queries. Return explicit public DTO allowlists, including only the approved Organization public display name. Exclude exact pickup address/coordinates, private contacts, pickup instructions, verification evidence, moderation information and internal claim/state fields. No location-based discovery is approved.

The sole public Organization field is `name`; `type` is an unrestricted Phase 2 string, with no enum. The Donation status lifecycle beyond Available is intentionally undefined. Quantity units and per-unit precision are finalized in [Project status](../../PROJECT_STATUS.md); use Decimal128 and decimal-string API values. Store UTC instants, emit ISO 8601 UTC timestamps, and leave local-time display to the browser. Food-safety/eligibility and handling policies remain pending. Candidate index definitions remain unverified pending query-plan evidence.

## Index and seed guidance

Candidate indexes are `status + availableUntil`, `category + status + availableUntil`, and a text index on `title + description`. Treat these as candidates and validate with representative query plans before finalizing. The seed should create approximately 15–20 realistic demo donations across all seven approved food categories with valid Organization references. It must be development-only, idempotent, refuse production, never run at server startup, and never delete unrelated records.

## Error responses and security boundary

Donation endpoint errors use the mapping in [API specification](API_SPECIFICATION.md), with `details: null` initially. Use donation-scoped formatting so health and unrelated unknown-route behavior remain unchanged. Unexpected errors must not expose stack traces or database messages.

The public read APIs do not require Phase 2 authentication, but still validate inputs, limit pagination, avoid information leaks and serialize allowlisted fields only. Later authorization controls remain necessary for private operations introduced in later phases. Existing rate limiting, CORS, Helmet and centralized error middleware remain part of the foundation. Do not expose stack traces or internal errors in production.
