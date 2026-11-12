# FoodSurplus Development Roadmap

This roadmap follows the approved MVP decisions in [Product requirements](PRODUCT_REQUIREMENTS.md). Product workflows are planned unless explicitly marked completed in `PROJECT_STATUS.md`. Work in small reviewable increments; Phase 2 begins only after the project owner approves it.

## Phase 0 — Architecture consolidation (completed)

- Audit the scaffold and align requirements, system/frontend/backend architecture, schema, API, security, design system, testing and roadmap.
- Deliver the ten architecture documents plus `PROJECT_STATUS.md`.
- Exit: cross-document state, authorization, retention and phase dependencies are documented.

## Phase 1 — Design system and application shell (completed)

- Align tagline/copy and establish accessible Organic Sustainability tokens.
- Implement the public application shell, landing page, not-found page, responsive navigation, reusable baseline UI and Tailwind design tokens.
- Retain the shared Axios client and health-status UI.
- Exit: project owner completed desktop, tablet and mobile visual review; backend health endpoint and frontend Axios integration checks succeeded; frontend production build passed. These results are recorded in `PROJECT_STATUS.md`.

## Phase 2 — Public Experience & Real Donation Discovery (awaiting approval)

- Use real MongoDB-backed APIs for public donation discovery. API responses must come from persisted database records; never substitute mock API results or present fixture data as live donor activity after an API error.
- Add a Donation Mongoose model with schema validation and indexes appropriate to public availability, pickup deadline, category, donor organization and supported search. Select indexes based on the actual query contract; do not add a geospatial index until location policy and query behavior are approved.
- Provide a development-only seed script for sample donation records. It must refuse to run in production and must not be wired into normal server startup. Label seeded records as development/demo data where they can be recognized by developers.
- Implement public donation listing and detail APIs. Expose only available, eligible listings and privacy-safe public DTOs; return no exact address/coordinates, contact details, pickup instructions, claim data or private evidence.
- Validate query parameters and route identifiers. Support bounded pagination, search, category filters and availability filters. Define stable sorting and response metadata. Do not allow client-controlled MongoDB operators or arbitrary query fields.
- Implement frontend donation listing and detail pages, reusable donation cards and filters, and clear loading, empty and error states. Keep the API layer separate from presentation and do not fall back to local fixtures when the real API fails.
- Add backend tests for validation, filtering, pagination, API response behavior and privacy redaction; add frontend tests for listing/detail states, filters and accessibility-relevant interactions. Frontend automated testing is not currently configured, so select and approve any required test tooling before installing dependencies.
- **Required decision before location-based discovery:** project owner must approve the exact-location approximation precision and public location representation. Do not invent a precision or expose exact location. Other search/category/availability features may be implemented without location-based discovery until this decision is made.
- Donor publishing is not part of Phase 2. Development seed records are the discovery data source until donor listing creation is implemented in Phase 4.
- Exit: real API-backed listing and detail views work against MongoDB; server-side validation, pagination, filters and privacy rules are tested; owner reviews the phase results.

## Phase 3 — Authentication, organizations and minimum verification

- Implement one normal user/one organization membership, Donor/NGO role, secure login/session lifecycle and current-state authorization.
- Implement organization profiles, private evidence submission, admin approve/reject/resubmit and suspension decisions.
- Deliver the minimum admin verification queue/API and audit records now; both donor publishing and NGO claiming depend on approved organizations.
- Exit: auth, membership, evidence privacy and verification tests pass; no public admin registration.

## Phase 4 — Donor listings and pickup availability

- Approved donors create/edit/cancel listings, upload validated public food images, provide required food/handling/storage/deadline fields and propose non-overlapping pickup slots.
- Add automatic expiry of Available donations with preserved history.
- Do not place claim review in this phase; claims do not exist yet.

## Phase 5 — NGO portal

- Implement NGO organization profile and verification-status views; approved NGOs may inspect eligible public listings already delivered in Phase 2.
- Add NGO-specific discovery improvements only where requirements extend beyond the public discovery experience. Keep public maps optional and subject to the approved location policy; never return exact coordinates/contact/pickup details.
- Collection history waits until pickups exist in Phase 6.

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
