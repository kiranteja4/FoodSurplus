# FoodSurplus Testing Strategy

## Current test setup

Backend uses Jest with Node’s experimental VM modules and Supertest. Current tests cover health/404, CORS and the development DNS gate. `mongodb-memory-server` is installed but unused; no domain/business tests exist. Frontend has no test/lint/type-check script; it has a Vite build. No CI workflow was found in the inspected repository. This review did not run tests.

## Critical domain test matrix

### Organization and identity

- Public registration accepts Donor/NGO only and creates exactly one membership/organization in the pending verification state; admin cannot be self-registered.
- Donor and NGO verification evidence remains private; approve/reject, correction/resubmission and suspension state changes require admin and audit records.
- Unverified/suspended donors cannot publish; unverified/suspended NGOs cannot claim. Disabled users and stale tokens cannot use changed memberships.
- Cross-organization reads/writes fail even when IDs are valid.

### Food eligibility and privacy

- Required food/handling/storage/preparation/collection fields are validated; unknown handling or insufficient data is ineligible.
- Unknown allergens remain explicitly unknown and are never rendered as “none” or “safe.”
- `foodExpiryAt` and `pickupDeadline` are distinct and checked at creation, approval and expiry.
- Public list/detail/map responses contain approximate location only; exact address/contact/instructions/slots/evidence are unavailable before Approved claim to non-admin callers.
- Upload tests check byte limit, extension/MIME/content signature, unauthorized upload, Cloudinary failure and private verification evidence access.

### Canonical state-machine tests

**Donation:** `available → reserved → claimed → completed`; terminal alternatives `cancelled`, `expired`. Test every allowed/forbidden transition and exact active-claim pointer behavior.

**Claim:** `pending → approved | rejected | cancelled | expired`; `approved → completed | cancelled | exceptionReview`; `exceptionReview → completed | cancelled`. Rejection, eligible cancellation and pending timeout must release only the matching reservation, at most once. Terminal claims never reopen.

**Pickup:** `awaitingSlotSelection → scheduled → readyForPickup → completed`; `scheduled/readyForPickup → rescheduleRequested → scheduled`; `scheduled/readyForPickup → missed | disputed`; eligible pre-completion cancellation. Missed/disputed approved pickups remain claimed until explicit exception resolution; tests must prove there is no automatic redistribution.

### Concurrency and transaction tests

- Use `MongoMemoryReplSet` (replica set) or a dedicated disposable replica-set test database for transaction behavior; do not assume standalone `MongoMemoryServer` supports multi-document transactions.
- Send simultaneous distinct claim requests for one donation: exactly one succeeds, one active claim exists, and inventory is never allocated twice.
- Retry the same `Idempotency-Key`: return the same claim without duplicate reservation or notification.
- Race approve/reject/cancel/expiry jobs and assert compare-and-set transitions produce one terminal outcome and release only once.
- Race slot selections for the same donor slot and assert only one pickup books it. Test overlapping slot rejection and atomic rescheduling without losing or double-booking the existing slot.
- Inject failures between writes and assert transaction rollback leaves donation/claim/notification/slot state consistent.

### Expiry and pickup

- Pending claim expiry uses stored `approvalExpiresAt = min(request time + configured window, pickupDeadline)` and a fake clock.
- Expiry job is safe to repeat and preserves records. It returns a donation to Available only if still within deadline and donor organization remains approved/active; otherwise the donation is Expired/Cancelled.
- Approved missed pickups enter exception review, remain non-public, and require a documented admin outcome. Re-listing requires donor revalidation and a future pickup deadline.
- Test donor slot proposals, NGO confirmation, ready/collection confirmation, rescheduling, cancellation permissions, missed and disputed paths.

### API, security, notifications and UI

- API tests cover response/error envelopes, health response compatibility, method-level permissions, rate limits, CSRF/origin checks, malformed IDs, NoSQL operators and production error redaction.
- Auth tests cover password hashes, access expiry, refresh rotation, revoked-token reuse/family revocation, logout, disabled accounts and organization suspension taking effect promptly.
- Notifications test correct recipients for verification, claim, pickup and exception events; verify unread count/read state/history, no cross-user reads and no email/SMS/socket requirement in MVP.
- Audit tests cover verification decisions, suspension/reactivation, moderation and exception resolution without secrets/private evidence in logs. Retention cleanup tests use the approved policy; do not add arbitrary TTL periods.
- Frontend tests (when a framework is approved) cover verification/role navigation UX, explicit mock-vs-real adapters, loading/empty/error/success states, location redaction, keyboard access and responsive layout. Do not introduce a frontend test dependency without explaining the need.

## Existing dependency and execution constraints

Use existing Jest, Supertest and MongoDB Memory Server dependencies. Mock Cloudinary at service boundaries and Socket.IO until realtime is approved. Keep tests independent of developer `.env`; set `DEV_USE_PUBLIC_DNS=false` and use fake database/JWT values in the test process. Never connect destructive test cases to a developer’s Atlas database. Run focused tests per module, then the whole backend suite and frontend build; report exact results and known limitations.

## Current gaps

The repository has no authentication, schemas or product routes, so the present suite cannot exercise the above rules yet. Define the associated tests alongside each implementation phase. Do not claim any planned test coverage as current coverage.
