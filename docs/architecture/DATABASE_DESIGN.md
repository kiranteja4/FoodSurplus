# FoodSurplus Database Design

## Status

No domain Mongoose schemas or indexes exist in the repository. The database is currently used only for the Mongoose connection and health-state response. The following is the approved MVP target; it is not implemented.

## Collections and relationships

### Users and organization membership

**User:** `_id`, canonical/normalized unique email, `passwordHash`, `systemRole` (`member` or separately provisioned `admin`), `accountStatus` (`active`/`disabled`), `authVersion`, timestamps. No plaintext password or JWT values.

**OrganizationMembership:** `_id`, `userId`, `organizationId`, role (`donor`/`ngo`), membership status, timestamps. Enforce one active membership per normal user in MVP; keep a separate relationship collection so multiple organizations can be added later. Admin users have no normal membership. Index `userId` uniquely for the MVP constraint and `{organizationId, status}` for member resolution. Remove/replace the single-membership constraint only in a planned multi-org migration.

### Organizations and verification

**Organization:** `_id`, type (`donor`/`ngo`), donor category where applicable, legal/display name, `verificationStatus` (`notSubmitted`, `pending`, `approved`, `rejected`), `operationalStatus` (`active`, `suspended`), safe profile fields, private exact contact/address, public approximate location, timestamps. Keep verification state distinct from suspension.

**VerificationSubmission:** `_id`, organization, submitter, revision, evidence asset references, status, reviewer, decision/rejection reason, timestamps. Evidence is private Cloudinary storage (or another approved private store), not an organization profile URL. Index organization/status and organization/revision. Admin evidence access is separately authorized and short-lived.

### Donations

`_id`, donor organization, title/description, category, positive quantity/unit, `status` (`available`, `reserved`, `claimed`, `completed`, `cancelled`, `expired`), `activeClaimId`, preparation/packing details, handling history (`known`/`unknown` plus details), storage method/instructions, allergen disclosure status and declared allergens, `foodExpiryAt` when applicable, `pickupDeadline`, private exact pickup address/instructions, public approximate location, public image references, timestamps.

The MVP is all-or-nothing: no `reservedQuantity`/partial allocation field. A claim quantity equals donation quantity. Do not include exact location or contact fields in public projection. Index `{status, pickupDeadline}`, `{donorOrganizationId, createdAt}`, and a `2dsphere` index only on the explicitly approximate public location.

### Claims

`_id`, donation, donor organization, NGO organization, full requested quantity/unit, status (`pending`, `approved`, `rejected`, `cancelled`, `expired`, `completed`, `exceptionReview`), `approvalExpiresAt`, idempotency key/requester, decision actor/reason, transition timestamps, timestamps.

One active claim at a time per donation. Enforce by conditional donation status/`activeClaimId` update inside a transaction plus a unique idempotency key. A claim is not a partial allocation. Index `{ngoOrganizationId, status, createdAt}`, `{donationId, status}` and unique `{requesterUserId, idempotencyKey}`. A second distinct request after reservation returns a conflict.

### Pickup slots and pickups

**PickupSlot:** donor organization, stable slot ID, UTC start/end, availability/booked/withdrawn state, linked pickup when booked. Slot offers for one donor organization must be non-overlapping; selecting a slot atomically changes it from available to booked. Use unique `{donorOrganizationId, slotId}`. Validate overlap when donor creates/replaces a batch of slots; do not rely on UI checks.

**Pickup:** one per approved claim, claim/donation/organization references, status (`awaitingSlotSelection`, `scheduled`, `readyForPickup`, `rescheduleRequested`, `completed`, `missed`, `disputed`, `cancelled`), selected slot, collection confirmer/time, dispute/exception references, timestamps. Enforce one pickup per claim. A missed/disputed pickup does not release the donation automatically.

### Refresh sessions

**RefreshSession:** user, unique token hash/JTI, token-family ID, expiry, revoked time/reason, replacement session, last-used time and minimal device metadata. Never store the raw refresh token. Index token hash uniquely and user/family; use expiry cleanup only after revocation/reuse behavior is correct. Auth version or active-account checks invalidate access after disablement/role changes.

### Notifications and audit logs

**Notification:** one record per recipient user; type, safe resource reference, created/read timestamps, minimal display data. Index `{recipientUserId, readAt, createdAt}` and recipient history. Persist state changes in MongoDB; REST provides history and unread count. No email/SMS or socket transport in MVP.

**AuditLog:** actor, action, target, organization, safe before/after fields, reason, request ID, outcome and timestamp. Log verification submission/decision, suspension/reactivation, moderation and exception resolution. Restrict read access; enforce append-only through application policy and database role permissions. Set retention policy before cleanup.

## Canonical state machines

### Donation

`available → reserved → claimed → completed`; terminal alternatives are `cancelled` and `expired`.

- `available → reserved` with Pending claim creation.
- `reserved → claimed` only when donor approves before both deadlines.
- `reserved → available` on rejection, eligible cancellation or pending expiry only if donor organization remains approved/active, pickup deadline is future and no other active claim exists.
- `available/reserved → cancelled` on donor cancellation; never republish a donor-cancelled listing.
- `available/reserved → expired` at the relevant deadline; preserve record/history.
- `claimed` stays claimed during approved pickup exception review. It becomes `completed` on collection confirmation; it can return to `available` only after eligible exception/cancellation resolution and donor revalidation. Otherwise close as `cancelled`/`expired`.

### Claim

`pending → approved | rejected | cancelled | expired`; `approved → completed | cancelled | exceptionReview`; `exceptionReview → completed | cancelled`. Terminal claims never reopen. A resolution that makes food eligible again creates availability on the donation, not a reopened claim.

### Pickup

`awaitingSlotSelection → scheduled → readyForPickup → completed`; `scheduled/readyForPickup → rescheduleRequested → scheduled`; `scheduled/readyForPickup → missed | disputed`; pre-completion states may become cancelled under the authorized cancellation rules. The NGO’s collection confirmation completes the pickup in the proposed MVP; the donor can dispute. Final confirmation/dispute window remains a release setting.

## Atomic allocation, expiry and retention

Use MongoDB transactions on Atlas replica-set topology. Claim request transaction: conditional `available → reserved` update with active claim pointer, insert Pending claim with immutable `approvalExpiresAt`, and insert donor notification. Approval transaction updates claim and donation. Rejection/cancel/expiry transaction closes claim, conditionally clears the matching pointer, sets donation Available/Expired/Cancelled under the eligibility/deadline rules, and records notification. Use idempotency keys and compare-and-set filters so retried or concurrent jobs cannot duplicate/release twice.

`approvalExpiresAt = min(request time + configured approval window, pickupDeadline)`. The job preserves expired records and only returns an unexpired, eligible listing to Available. Approved missed pickups remain claimed until an admin/authorized exception resolution; never auto-redistribute.

Do not attach TTL deletion to donations, claims, pickups, verification evidence, audit logs or notifications until approved retention schedules exist. Preserve donation/claim/pickup history. Verification evidence retention is limited to verification, disputes and applicable obligations; user data follows applicable privacy/deletion requirements. No arbitrary legal retention periods are specified here.
