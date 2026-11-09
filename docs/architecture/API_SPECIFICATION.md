# FoodSurplus API Specification

## Status and common conventions

Only `GET /api/v1/health` is implemented. It currently returns `{ success: true, service: "foodsurplus-api", database: "..." }`; the frontend reads `service` and `database` at the top level. Preserve this operational endpoint’s current response for compatibility. The root `API_DOCUMENTATION.md` remains a placeholder.

All **new business endpoints** are relative to `/api/v1` and use:

- Success: `{ "success": true, "data": ... }`; list endpoints may include `meta` for bounded pagination.
- Error: `{ "success": false, "error": { "code": "...", "message": "...", "details": [...] } }`.
- Standard codes: 400 invalid input, 401 missing/invalid auth, 403 role/ownership/status denied, 404 absent or intentionally undisclosed private resource, 409 state/idempotency/concurrency conflict, 413 upload too large, 429 limited, 500 generic.
- Validate params/query/body with Zod; never return MongoDB internals, credentials or production stack traces. New error responses use this envelope; the existing health payload stays unchanged until a deliberate compatibility migration.
- Require an `Idempotency-Key` on claim creation. Store the key per requester and return the original claim on retry; a distinct request against an already-reserved donation receives 409.

## Roles and authorization invariants

- Public means unauthenticated and receives privacy-filtered data only.
- Normal users have one Donor or NGO membership. Admin is a separately provisioned system role; public registration cannot assign it.
- Donor actions require active membership in the donation’s donor organization, approved verification and active organization status. NGO claim actions require the same for the NGO organization.
- Every private read and mutation checks current account, membership, organization status, resource ownership and current persisted state. Frontend role guards are not authorization.
- Admin routes require admin authorization; verification, suspension, moderation and exception decisions are audited.
- Suspended organizations cannot publish/claim. Pending claims are closed and reservations safely released only under the canonical transaction rules; approved claims enter exception review. Exact suspension disposition should be confirmed before release.

## Endpoint plan

| Method and path (under `/api/v1`) | Access | Contract / invariant |
|---|---|---|
| `GET /health` | Public | Existing top-level compatibility response; no feature data |
| `POST /auth/register` | Public, limited | Accept only Donor or NGO; create normal user, one membership and organization in `pending` verification; never allow Admin |
| `POST /auth/login` | Public, strongly limited | Generic credential failure; return short-lived access token and refresh cookie |
| `POST /auth/refresh` | Refresh cookie + CSRF/origin checks | Rotate session; detect reuse and revoke family |
| `POST /auth/logout` | Auth + refresh/CSRF checks | Revoke current refresh session and clear cookie |
| `GET /auth/me` | Authenticated | Safe account, membership and current verification/suspension state |
| `GET /organizations/me` | Organization member | Own organization only |
| `PATCH /organizations/me` | Active organization member | Allowlisted profile fields; verification-sensitive changes may require resubmission |
| `POST /organizations/me/verification-submissions` | Active member | Submit a revision with private evidence references; donor and NGO both supported |
| `GET /organizations/me/verification-submissions` | Organization member | Own submission status/history; never expose private asset URLs |
| `GET /admin/verification-submissions?status=pending` | Admin | Review queue |
| `GET /admin/verification-submissions/:id/evidence/:assetId` | Admin | Audited, short-lived access to private evidence |
| `POST /admin/verification-submissions/:id/decision` | Admin | Approve or reject with reason; rejection allows correction/resubmission; audit decision |
| `POST /admin/organizations/:id/suspend` | Admin | Suspend with reason; audit and apply approved pending/approved-claim disposition |
| `POST /admin/organizations/:id/reinstate` | Admin | Reinstate only after required verification review; audit |
| `GET /donations` | Public | Return only `available` listings with approximate location and safe public fields |
| `GET /donations/:id` | Public | Available listing only; return 404 for unavailable/private listings; never reveal exact address/contact/slots |
| `POST /donations` | Approved active Donor member | Create eligible listing with food fields and separate `foodExpiryAt`/`pickupDeadline` |
| `PATCH /donations/:id` | Owning approved active Donor | Edit only while Available; validate all fields and deadlines |
| `POST /donations/:id/cancel` | Owning Donor | Explicit state transition; no hard delete; closes pending claim safely |
| `POST /donations/:id/images` | Owning approved active Donor | Validate size/content/type; upload public listing image using server-controlled Cloudinary access |
| `POST /donations/:id/claims` | Approved active NGO member | All-or-nothing; immediately reserve donation and create Pending claim transactionally; return 409 if unavailable |
| `GET /claims` | Claim participant/admin | Return only claims visible to caller’s organization; admin access audited |
| `GET /claims/:id` | Claim participant/admin | Exact pickup details only for approved claim participant or authorized admin |
| `POST /claims/:id/approve` | Owning approved active Donor | Pending only, before approval/pickup deadline; donation `reserved → claimed` atomically |
| `POST /claims/:id/reject` | Owning Donor | Pending only; reject with optional reason and safely release reservation |
| `POST /claims/:id/cancel` | Claim participant under policy | Pending NGO cancellation releases if eligible; approved cancellation only before pickup begins and after eligibility/release rules; otherwise exception/admin resolution |
| `GET /admin/claims/exceptions` | Admin | List missed/disputed approved claim exceptions |
| `POST /admin/claims/:id/resolve` | Admin | Record outcome/reason; never republish without donor eligibility revalidation and future pickup deadline |
| `POST /claims/:id/pickup-slots` | Owning approved active Donor, Approved claim | Propose non-overlapping discrete slots; do not expose them publicly |
| `POST /pickups/:id/slots/:slotId/confirm` | Approved NGO claimant | Select/book one available slot atomically; prevent double booking |
| `POST /pickups/:id/reschedule-requests` | Pickup participant | Explicit request; reserve replacement before releasing current slot |
| `POST /pickups/:id/ready` | Owning Donor | Mark ready only for the scheduled pickup |
| `POST /pickups/:id/collection-confirmation` | Approved NGO claimant | Confirm collection; transitions pickup/claim/donation to completed |
| `POST /pickups/:id/disputes` | Pickup participant | Record missed/disputed collection; enters exception workflow, no automatic redistribution |
| `GET /notifications` | Authenticated | Own in-app history with pagination/read state |
| `GET /notifications/unread-count` | Authenticated | Own unread count |
| `POST /notifications/:id/read` | Recipient | Mark own notification read only |
| `/admin/users`, `/admin/moderation`, `/admin/audit` | Admin | Method-specific operations must be documented before implementation; sensitive writes audited |

Admin and private-evidence handlers must not accept user-supplied roles, verification state, location visibility or arbitrary transition values.

## State and concurrency contract

### Donation states

`available → reserved → claimed → completed`; terminal alternatives: `cancelled`, `expired`.

- Pending claim request transactionally moves `available` to `reserved` and creates `activeClaimId`.
- Donor approval moves `reserved` to `claimed`. Pending rejection/cancellation/timeout closes the claim and returns `reserved` to `available` only if the donor organization is approved/active, pickup deadline is future and the donation was not cancelled.
- Donor cancellation closes a pending claim and leaves the donation `cancelled`. Available listings expire at the pickup deadline. `foodExpiryAt` may make an item ineligible earlier.
- Approved pickup miss/dispute leaves the donation `claimed` during exception resolution. No automatic reallocation.

### Claim states

`pending → approved | rejected | cancelled | expired`; `approved → completed | cancelled | exceptionReview`; `exceptionReview → completed | cancelled`. Terminal claims do not reopen. Pending expiration is based on immutable `approvalExpiresAt = min(request time + configured window, pickupDeadline)`.

### Pickup states

`awaitingSlotSelection → scheduled → readyForPickup → completed`; `scheduled/readyForPickup → rescheduleRequested → scheduled`; `scheduled/readyForPickup → missed | disputed`; pre-completion pickups can be cancelled under policy. Missed/disputed pickups require exception resolution. NGO collection confirmation is the proposed completion signal; the donor may dispute.

All transitions are checked against persisted state and role. MongoDB transaction and compare-and-set filters ensure claim creation/approval/rejection/expiry/release, notification persistence and slot booking are atomic and idempotent. Return 409 for contention, stale state or duplicate active claim. Use a replica-set test database for transaction tests.

## Privacy and food fields

Public listing DTOs contain only approximate donation location, non-sensitive description/category/quantity, deadlines and public images. Never serialize the exact address, exact coordinates, contact information, pickup instructions, pickup slots, verification status/evidence or claim identifiers in list/map responses. Reveal exact pickup details only to the NGO whose claim is approved and authorized admins.

Food submissions explicitly represent known/unknown handling, storage, allergen declaration, preparation/packing information, `foodExpiryAt` where applicable and required `pickupDeadline`. Unknown handling or insufficient mandatory preparation/storage/collection information is ineligible. Unknown allergens are not “none”; display as unknown and apply the approved launch-jurisdiction policy. Do not return a food-safety certification.

## Auth, notifications and audit

New API auth uses a short-lived in-memory access token sent as Bearer and a rotating HttpOnly refresh cookie, with CSRF/origin protection for cookie-consuming refresh/logout. Cookie `SameSite`/`Secure` settings depend on deployment origin topology and must be finalized before release. Session records store token hashes, not raw refresh tokens.

MVP notifications are persisted per user and exposed through REST; no email/SMS or Socket.IO push. Emit types for verification submitted/decision/suspension, claim pending/approved/rejected/cancelled/expired, and pickup scheduled/rescheduled/ready/completed/missed/disputed. Notify only active members/participants of the relevant organizations; avoid private data in notification content.

Audit verification decisions, suspensions, moderation, exception resolution and sensitive admin actions with actor, target, safe changed fields and reason. Define evidence/audit/notification retention under applicable policy; no arbitrary periods or TTL cleanup are specified here.
