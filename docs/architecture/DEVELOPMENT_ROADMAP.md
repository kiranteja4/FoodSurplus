# FoodSurplus Development Roadmap

This roadmap follows the approved MVP decisions in [Product requirements](PRODUCT_REQUIREMENTS.md). Product workflows are planned, not implemented. Work in small reviewable increments; no application implementation begins until Phase 1 is explicitly approved.

## Phase 0 — Architecture consolidation (current)

- Audit the scaffold and align requirements, system/frontend/backend architecture, schema, API, security, design system, testing and roadmap.
- Deliver the ten architecture documents plus `PROJECT_STATUS.md`.
- Exit: cross-document state, authorization, retention and phase dependencies agree; owner approves Phase 1 separately.

## Phase 1 — Design system and application shell

- Align tagline/copy and establish accessible Organic Sustainability tokens.
- Add minimal public/auth/Donor/NGO/Admin route shells using existing frontend directories; implement route UX only, not permission security.
- Add essential loading/error/empty/status patterns and ensure mock data is explicitly selected and cannot replace failed real API calls.
- Exit: responsive shell and frontend build reviewed; no business workflow represented as complete.

## Phase 2 — Public landing and discovery prototype

- Build landing page and public listing/detail presentation against an explicit local mock adapter to validate layout and privacy-safe fields.
- Mark fixtures as demo data; do not imply they are live donations. Keep the real API adapter separate.
- Agree public listing DTO and approximate-location display. Real listing integration waits until verified donors can publish data in Phase 4.

## Phase 3 — Authentication, organizations and minimum verification

- Implement one normal user/one organization membership, Donor/NGO role, secure login/session lifecycle and current-state authorization.
- Implement organization profiles, private evidence submission, admin approve/reject/resubmit and suspension decisions.
- Deliver the minimum admin verification queue/API and audit records now; both donor publishing and NGO claiming depend on approved organizations.
- Exit: auth, membership, evidence privacy and verification tests pass; no public admin registration.

## Phase 4 — Donor listings and pickup availability

- Approved donors create/edit/cancel listings, upload validated public food images, provide required food/handling/storage/deadline fields and propose non-overlapping pickup slots.
- Add automatic expiry of Available donations with preserved history.
- Do not place claim review in this phase; claims do not exist yet.

## Phase 5 — Real public discovery and NGO portal

- Connect listing/discovery pages to the real privacy-safe API and add filters for category, quantity and location.
- Implement NGO organization profile and verification status; approved NGOs may inspect eligible public listings.
- Keep public maps optional; never return exact coordinates/contact/pickup details. Collection history waits until pickups exist in Phase 6.

## Phase 6 — Claims, pickups, expiry, notifications and exceptions

- Implement the one-NGO, all-or-nothing claim model: Pending request reserves the entire donation immediately; donor approves/rejects; idempotent approval-window expiry and release.
- Add donor claim review here, not in Phase 4. Use Atlas transactions, conditional updates, idempotency and concurrent-request tests.
- Add pickup slot selection/booking, readiness, rescheduling, collection confirmation, cancellation, missed/disputed exceptions and admin resolution endpoints.
- Implement persisted in-app notifications, unread count and history as part of the MVP. REST remains authoritative; do not add email/SMS or require Socket.IO.
- NGO collection history begins only after pickup data exists.
- Exit: state/permission matrix, over-allocation, reservation release, expiry, no-double-booking and missed-pickup tests pass.

## Phase 7 — Maps and optional realtime delivery

- Add Leaflet map/list discovery only after location privacy and accessible list behavior are verified.
- Socket.IO is optional follow-up: authenticate handshakes, authorize rooms/events, deliver minimal notices after committed writes, and recover through REST. It is not required for the MVP notification contract.

## Phase 8 — Full administrator portal

- Extend the minimal Phase 3 verification capability with user/listing/claim moderation, exception resolution views, audit history and platform statistics.
- All privileged operations remain server-authorized and audited.

## Phase 9 — Integration, security and deployment readiness

- End-to-end workflows, threat/security review, dependency/secret review, backups/restore, structured redacted logging, readiness/liveness, graceful shutdown, CI and deployment runbooks.
- Remove `DEV_USE_PUBLIC_DNS` after system DNS supports Atlas SRV/TXT. Production uses platform-managed DNS.
- Set approval-window value, pickup slot/timezone policy, food eligibility jurisdiction, evidence review criteria and retention schedules before launch.

## Legacy tracking note

The existing README and Development Log use older phase numbering. They are not edited in this documentation-only task; reconcile them in a later approved documentation pass so they do not imply that product phases are complete.
