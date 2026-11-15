# FoodSurplus Database Design

## Current state

MongoDB is connected for the existing health foundation. The Phase 2 Organization and Donation models are implemented as M1 work; product indexes and persisted records are not. Remaining design sections describe planned work and must not be reported as implemented.

## Phase 2 models

### Organization (minimal)

Initial purpose: associate Donation records with an organization and provide its public display name. Minimum fields: `_id`, `name`, `type`, `createdAt`, `updatedAt`. `name` is the sole public Organization field. `type` is an unrestricted string in Phase 2; do not add an enum or confuse it with food categories. Other Organization fields remain private. Do not add users, authentication, registration, verification, private contacts, admin approval or dashboards in Phase 2. Phase 3 may extend this model.

### Donation

Document the Phase 2 persistence needs: `_id`, Organization reference, `title`, `description`, approved food `category`, `quantity`, `availableQuantity`, `quantityUnit`, `status`, `availableUntil`, optional `foodExpiryAt`, optional `preparedAt`, optional `packedAt`, and timestamps. Use Decimal128 quantities with the approved per-unit precision; `availableQuantity` must not exceed `quantity`. The only status defined for Phase 2 public discovery is Available; do not define future lifecycle values or transitions. Do not introduce `pickupDeadline`. Food-safety and handling policies remain outside this model decision.

Only Available records with future `availableUntil` and positive `availableQuantity` are public. Public DTOs must be explicit allowlists and must not serialize whole documents. Private pickup address/coordinates, contact data, pickup instructions, verification evidence, internal moderation data and internal claim/state details are excluded. No location-based discovery or approximate-location field is approved yet.

The canonical controlled food categories are exactly: Prepared Meals; Fruits & Vegetables; Bakery; Dairy Products; Packaged Food; Grains & Staples; Other. Use the shared `shared/donationCategories.mjs` definition across frontend options, backend validation, persistence and seed data. These categories identify food, not donors.

Quantity units and precision are owner-approved: kg up to 3 decimal places; g whole numbers; L up to 3 decimal places; mL whole numbers; servings up to 2 decimal places; packets whole numbers by default, with fractional quantities only for meaningful partial packets. Reject malformed, non-finite, zero, negative and out-of-range values. Do not set a maximum donation quantity. Use decimal strings at the API boundary and in public responses to avoid binary floating-point loss.

## Public Donation DTO

The explicit allowlist is `id`, `title`, `description`, `category`, `quantity`, `availableQuantity`, `quantityUnit`, `availableUntil`, optional `foodExpiryAt`, optional `preparedAt`, optional `packedAt`, and nested Organization `name` only. Never serialize raw documents. Omit Donation status, Organization `_id`, `type`, timestamps, and all exact location, private contact, pickup instruction, verification, moderation and internal claim/state fields.

## Date and availability contract

Persist UTC instants and serialize timestamps as ISO 8601 UTC strings. The server determines eligibility: status Available, `availableUntil` later than server time, and `availableQuantity` greater than zero. Browser local time affects display only. `foodExpiryAt` does not add an availability rule without food-safety policy.

## Index candidates

Candidates for query-plan evaluation are:

- `status + availableUntil`
- `category + status + availableUntil`
- Text index on `title + description`

These are not finalized index definitions. Validate actual query plans and MongoDB index constraints before selecting compound order or deploying indexes. Do not add a geospatial index.

## Development seed

Plan approximately 15–20 realistic demo donations, with valid Organization references and all seven approved categories represented. The seed is development-only, idempotent, blocked in production, never automatically run at server startup, and must not delete unrelated records. No seed script currently exists.

## Phase 3 boundary

Do not add authentication, user/membership relationships, verification submissions, private organization contact management, claims, reservation fields, pickup slots, audit/notification models or admin workflows to Phase 2. Organization can be extended in Phase 3 after its requirements are defined.

## Unverified items and remaining policy boundaries

Final index definitions remain unverified until query-plan validation. The complete future Donation lifecycle remains intentionally undefined. Launch-jurisdiction food-safety/eligibility policy and food-handling requirements remain pending. Do not infer them from demo records or schema fields.
