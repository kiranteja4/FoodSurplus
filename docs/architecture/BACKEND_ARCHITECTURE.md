# FoodSurplus Backend Architecture

## Current implementation

The backend is an ES-module Express app. Existing top-level directories already include `config`, `routes`, `controllers`, `services`, `models`, `validators`, `middleware`, `sockets`, `jobs` and `utils`; only config, health route, error utilities and middleware are populated. `server.js` initializes HTTP/Socket.IO, applies the optional development DNS setting, connects MongoDB and then listens. `app.js` applies Helmet, credentialed CORS, JSON parsing, cookies, NoSQL sanitation, Morgan in non-test environments, a global `/api` rate limit and `/api/v1/health`.

There are no auth or business routes, models, controllers, validators, uploads, Socket.IO authentication/events or jobs. JWT, bcryptjs, multer, Cloudinary and node-cron are installed but not used for product features. `asyncHandler` and `ApiError` are present but not yet used by feature routes.

## Chosen structure: layered directories already scaffolded

Keep the existing top-level layers and add focused feature files within them:

```text
src/
  app.js, server.js
  config/       env, db, cors
  routes/       auth, organizations, donations, claims, pickups, notifications, admin
  controllers/  HTTP translation by feature
  services/     domain rules and transactions by feature
  models/       User, Organization, Membership, Donation, Claim, Pickup, etc.
  validators/   Zod params/query/body schemas by feature
  middleware/   authenticate, authorize, validate, rate limits, errors
  jobs/         idempotent donation/claim expiry and retention work
  sockets/      later authenticated event handlers (not MVP delivery)
  utils/        current ApiError/asyncHandler and small shared helpers
```

Do not introduce a nested `modules/<feature>/<layer>` tree or a generic repository framework. Routes stay declarative; controllers translate HTTP; services own business rules, authorization preconditions and database transactions; models own schema validation/index definitions. Existing modules should be extended rather than migrated.

## Middleware and endpoint responsibilities

1. Helmet and CORS.
2. Request/correlation ID and redacted structured logs (not present yet).
3. Body limits, cookie parsing and Mongo sanitization.
4. API-wide and route-specific rate limits.
5. Authentication and current account/membership/organization state resolution.
6. Role, organization membership, resource ownership and verification/operating-state checks.
7. Zod validation of route params, query and body.
8. Controller → service → Mongoose model/session.
9. Standardized response/error mapping.

The current API-wide limit is 300 per 15 minutes. Add tighter login, registration, refresh, evidence/image upload, verification decisions and expensive-search limits. Configure trusted proxy hops only for the actual deployment. Use a shared limiter store only if the service is deployed across multiple instances; no dependency is approved for that yet.

## Approved domain rules and atomic operations

### Claim creation and reservation

One donation permits one all-or-nothing active claim. In a MongoDB transaction, conditionally change `Donation.status` from `available` to `reserved`, set `activeClaimId`, create the `pending` claim for the full quantity, and persist the donor notification. A retry with the same idempotency key returns the same claim. A different concurrent request that no longer matches `available` returns 409. The transaction must commit all writes or none.

Approval changes `pending` to `approved` and `reserved` donation to `claimed` only if the approval deadline and pickup deadline remain future and both organizations remain approved/active. Rejection, eligible cancellation or pending timeout atomically closes the claim, clears the matching active claim pointer and releases the donation only if still eligible. All release jobs use conditional state filters and are safe to repeat.

Use Atlas replica-set transactions and a replica-set MongoDB Memory Server fixture for tests. Do not implement a weaker read-then-write reservation path.

### Expiry and exception handling

`foodExpiryAt` and `pickupDeadline` are separate. A scheduled job transitions available donations at their deadline and pending claims at their stored `approvalExpiresAt`; on pending expiry, release to `available` only if the donation remains valid and active, otherwise expire/cancel it. Never delete history through TTL.

An approved pickup missed/disputed deadline leaves the donation `claimed`; pickup becomes `missed`/`disputed` and claim becomes `exceptionReview`. Do not automatically redistribute. Admin resolution closes the claim and only returns a donation to `available` after donor revalidation and while its deadline remains future.

### Verification and suspension

Both donor and NGO organizations need an approved verification submission before publishing or claiming. Store evidence references in a private verification-submission model; only authorized admins can issue short-lived access. Rejection can be corrected/resubmitted. Organization suspension blocks new publishing/claims and is audited. Proposed default: pending claims are closed with safe reservation release; approved claims go to exception review. Exact suspension disposition is a release policy to confirm.

### Pickup and notifications

After approval, the donor proposes non-overlapping slots; the NGO selects/confirms one. Lock the slot atomically to prevent double booking. NGO collection confirmation completes pickup/claim/donation; a dispute enters exception review. Persist in-app notification records in the relevant transaction. MVP has no socket or external email/SMS delivery.

## Security and operations

- Verify current account, membership, organization approval/active state and ownership on every protected operation; never trust role/status in client input or stale token claims.
- Use session-aware auth design in [Auth and security](AUTH_AND_SECURITY.md); redact secrets and private evidence from logs.
- Keep public listing DTOs allowlisted with approximate location only.
- Keep public donation images separate from private verification evidence and validate file bytes, size and type before Cloudinary transfer.
- Current server waits for MongoDB before listening and has no readiness/liveness split, graceful shutdown, retry/backoff or production structured logger. Define these before deployment.
- The development DNS override is temporary, default-off and rejected outside development. Production uses platform-managed DNS.
