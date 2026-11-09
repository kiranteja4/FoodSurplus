# FoodSurplus Product Requirements

## Product summary and implementation status

FoodSurplus connects businesses and institutions with edible surplus food to verified NGOs and charitable organizations that can collect and redistribute it. The approved visual direction is Organic Sustainability and the approved tagline is **“Less waste. More nourishment. Stronger communities.”**

These are approved MVP requirements, not implemented workflows. The repository currently has a React health-status page, one Express health route, MongoDB connection setup and security middleware. No user, organization, donation, claim, pickup, notification or admin feature is implemented.

## Actors, membership and verification

- Normal accounts have one primary role, Donor or NGO, and belong to one organization in the MVP. Model membership separately so multiple organizations can be supported later without building that feature now.
- Admin is a separately provisioned system role; public registration must never create an admin.
- Both donor and NGO organizations submit evidence and require administrator approval. Rejected organizations may correct their submission and resubmit. Verification evidence stays private.
- Only approved, active donor organizations can publish donations. Only approved, active NGO organizations can claim them.
- Suspension blocks new publishing/claiming. Proposed safe default for existing work: pending claims are closed and reservations released only through an idempotent transition; approved claims enter exception review and are not automatically redistributed. Confirm the exact suspension disposition before implementing it.

Donor categories are organization metadata: restaurants/cafes, hotels/caterers, hostels/educational institutions, event organizers, and grocery/retail businesses. They are not authorization roles.

## Donation and claim requirements

- An approved donor creates and manages a listing with food category, quantity/unit, preparation/packing details, handling history, storage method/instructions, allergen disclosure, food expiry where applicable, collection deadline, pickup instructions/slots and optional images.
- Unknown values must be explicit. Unknown handling history or insufficient preparation/storage/collection details makes a listing ineligible. Never translate unknown allergens or handling into “none” or “safe.” Do not make platform safety guarantees.
- One donation is all-or-nothing and can be allocated to at most one NGO in the MVP. Partial claims and multiple NGOs per donation are out of scope.
- Only an approved NGO may request a claim. The request immediately reserves the whole donation and enters Pending. The donor must approve or reject it. Rejection, eligible cancellation and pending timeout release the reservation atomically and idempotently.
- A Pending claim expires after a configurable approval window. Store the computed `approvalExpiresAt` on the claim so later configuration changes do not move existing deadlines. Approval is forbidden at/after that time or after the pickup deadline.
- Approved claims that miss pickup enter exception resolution. Do not return them to public availability automatically; a responsible party must verify eligibility and explicitly resolve the exception.

## Canonical state machines

These states are the single MVP baseline for the other architecture documents.

### Donation

`available → reserved → claimed → completed`

- `available → reserved`: a transaction creates one pending claim and reserves the entire donation.
- `reserved → claimed`: donor approves the pending claim.
- `reserved → available`: claim is rejected, cancelled when eligible, or expires, provided the listing remains active, the donor organization is approved/active and the pickup deadline has not passed.
- `available/reserved → cancelled`: donor cancels; any pending claim is closed and its reservation is released, but the donation is not republished.
- `available/reserved → expired`: the relevant collection/pickup deadline passes; pending claim expiry and release happen atomically.
- `claimed → completed`: collection is confirmed. If an approved claim is missed/disputed, the donation stays `claimed` during exception review.
- `claimed → available` is allowed only after an eligible cancellation/exception resolution, donor re-confirms the food remains eligible, and the pickup deadline is still future. Otherwise close it as `cancelled` or `expired`.

No partial-allocation state exists in the MVP. `completed` belongs to the donation only after its sole claim/pickup is completed.

### Claim

`pending → approved | rejected | cancelled | expired`

`approved → completed | cancelled | exceptionReview`

`exceptionReview → completed | cancelled`

`rejected`, `cancelled`, `expired` and `completed` are terminal. Resolution may return the donation to `available` only under the eligibility/reconfirmation rule above; it does not reopen the old claim.

### Pickup

`awaitingSlotSelection → scheduled → readyForPickup → completed`

`scheduled/readyForPickup → rescheduleRequested → scheduled`

`scheduled/readyForPickup → missed | disputed`

`awaitingSlotSelection/scheduled/readyForPickup → cancelled`

Missed/disputed pickups are handled with the claim’s `exceptionReview`; they never trigger automatic redistribution. NGO collection confirmation is the proposed MVP completion signal; the donor may raise a dispute. Confirm the dispute window and final confirmation policy before implementation.

## Pickup scheduling

The donor proposes available, non-overlapping pickup slots after claim approval. The NGO selects and confirms one. Selection atomically books a slot so it cannot be used by another active pickup for the same donor organization. Rescheduling must reserve the replacement slot before releasing the existing booking. Define time zone, slot duration, cancellation permissions and no-show/dispute handling before release.

## Location privacy and visibility

- Public donation list/detail responses and map data contain only an approximate location; never serialize exact coordinates, exact address, contact details or pickup instructions publicly.
- Exact pickup address/contact/instructions are available only to the NGO whose claim is Approved (and to authorized admins). Pending claim status does not unlock them.
- Admin access to private verification evidence and operational details is authorized and audited.

## Notifications, administration and records

- MVP notifications are in-app only, persisted in MongoDB, with recipient, type, resource reference, created/read timestamps, unread count and history. No email/SMS integration initially.
- REST is the notification source of truth. Socket.IO delivery is deferred and, when added, only delivers private event notices after committed changes.
- Admin verifies both organization types, suspends organizations, manages users/listings and resolves exceptions. Sensitive decisions are audited.
- Preserve donation/claim/pickup history. Retain verification evidence as necessary for verification, disputes and applicable obligations; follow applicable privacy/deletion requirements for user data. Define an audit/notification retention policy before implementing cleanup; do not invent legal periods or add TTL deletion until approved.

## Current versus planned

**Present:** React/Vite health page, shared Axios client, Express health route, Mongoose connection, environment validation, Helmet/CORS/body parsing/NoSQL sanitation/rate limiting, Socket.IO server initialization, and starter health/CORS/DNS tests.

**Not present:** domain models, verification, authentication, RBAC, donations, claims, pickups, image/evidence uploads, in-app notifications, audit events, maps or feature UI.

## Remaining implementation inputs

The product direction is approved. Before the affected workflows are built, select the approval-window value; verification evidence types/review checklist; launch-jurisdiction food eligibility policy; pickup time-zone/slot duration and confirmation/dispute rules; precise suspension and eligible-cancellation handling; public-location approximation precision; and retention/cleanup policy. These are implementation settings/policies, not permission to weaken the approved decisions above.
