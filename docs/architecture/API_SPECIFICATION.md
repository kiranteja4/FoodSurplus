# FoodSurplus API Specification

## Status and conventions

The only implemented application endpoint is the health route documented in [API documentation](../../API_DOCUMENTATION.md). This file specifies planned Phase 2 donation discovery APIs; they are not implemented. Preserve the existing health response shape. Validate parameters with the existing Zod convention and never expose production stack traces.

Successful business responses use `{ success: true, data: ... }`. Donation errors use `{ success: false, error: { code, message, details } }`; `details` is `null` for the initial public contract. Missing and unavailable donation details use the same generic not-found response and reveal no private history.

Initial Donation error mapping:

| HTTP status | Code | Message | Details |
|---|---|---|---|
| 400 | `VALIDATION_ERROR` | `Invalid request` | `null` |
| 404 | `NOT_FOUND` | `Donation not found or unavailable` | `null` |
| 429 | `RATE_LIMITED` | `Too many requests` | `null` |
| 500 | `INTERNAL_ERROR` | `Request could not be completed` | `null` |

Do not expose stack traces, database messages, or private reasons. Keep the existing health response and unrelated unknown-route behavior unchanged. Implement donation-specific formatting without changing unrelated routes.

## Base path

`/api/v1/donations`

## Endpoints

| Method and path | Access | Contract |
|---|---|---|
| `GET /api/v1/donations` | Public | List eligible donations using optional search/category, bounded pagination and stable sorting |
| `GET /api/v1/donations/:id` | Public | Return eligible public detail; missing or ineligible records receive generic unavailable/not-found behavior |

No authentication or registration endpoints, writes, claims, publishing or location endpoints are included in Phase 2.

## List query parameters

| Parameter | Rules |
|---|---|
| `page` | Positive integer, default `1` |
| `limit` | Positive integer, default `12`, maximum `50` |
| `search` | Optional text; MongoDB token-based text search over `title` and `description`, not arbitrary substring matching |
| `category` | Optional member of the seven approved food categories |
| `sort` | Default `soonest`; default ordering is `availableUntil` ascending, `createdAt` descending, `_id` ascending |

There is no availability query parameter. Server eligibility is always: `status` Available, `availableUntil` later than server time, and `availableQuantity` greater than zero. Search input must never be interpreted as Mongo operators.

## Response shape

List success: `{ success: true, data: { items: [], pagination: { page: 1, limit: 12, totalItems: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } } }`.

Detail success uses the same envelope with one allowlisted donation DTO in `data`. The approved DTO fields are `id`, `title`, `description`, `category`, `quantity`, `availableQuantity`, `quantityUnit`, `availableUntil`, optional `foodExpiryAt`, optional `preparedAt`, optional `packedAt`, and nested Organization `name` only. Quantities are decimal strings. Never serialize raw Mongoose documents.

## Privacy

Never serialize whole Mongoose documents. The sole public Organization field is `name`; exclude Organization `_id`, `type`, and timestamps. Also exclude exact pickup address and coordinates, private contacts, pickup instructions, verification evidence, internal moderation information, and internal claim/state details. No location fields or location-based discovery are included in Phase 2.

## M0 decisions and remaining boundaries

M0 decisions for category values, Organization fields, quantity precision, dates, DTO and donation error envelope are finalized in [Project status](../../PROJECT_STATUS.md). Store timestamps as UTC instants, serialize ISO 8601 UTC consistently, and let the browser display local time. The server alone evaluates availability. `availableUntil` is canonical; `foodExpiryAt` is separate and optional; `preparedAt` and `packedAt` are optional. Do not use `pickupDeadline` or apply food expiry as another eligibility rule without food-safety policy.

The complete future Donation lifecycle remains undefined. Food-safety/eligibility and food-handling policies remain pending. Candidate indexes require query-plan evidence; no query plan is claimed as verified. Approximate location and location discovery are excluded from Phase 2.
