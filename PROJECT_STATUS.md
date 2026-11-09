# FoodSurplus Project Status

## Current stage

Phase 1 design system and frontend foundation has been implemented. The production build passes. A visual browser review remains unverified because the in-app browser could not connect to the local Vite server; the frontend has no browser automation setup. Do not start Phase 2 until Phase 1 review is complete and explicitly approved.

## Approved product decisions

- Donor and NGO organizations both require administrator verification before publishing or claiming. Verification evidence is private.
- An MVP user has one primary Donor or NGO membership. Admin is separately provisioned.
- A claim is all-or-nothing for one NGO. Creating a pending claim immediately reserves the full donation; donor approval is required. Rejection, eligible cancellation and pending expiry release the reservation transactionally and idempotently.
- Food eligibility requires explicit preparation, handling, storage, allergen, expiry and collection details as applicable. Unknown handling history or insufficient critical details makes a listing ineligible; the platform does not guarantee food safety.
- Donation and pending-claim expiry are automatic while preserving history. Missed or disputed approved pickups require explicit exception resolution and are never automatically redistributed.
- Donors propose pickup slots; NGOs select and confirm. Booking must prevent double-booking. Collection confirmation, cancellation, rescheduling and disputes are tracked.
- Public discovery exposes approximate location only. Exact pickup details require an approved claim and server authorization.
- Notifications are persisted in-app records; REST is authoritative. Email/SMS and Socket.IO delivery are deferred.
- Donation, claim and pickup history is preserved. Retention and deletion policies must be set before cleanup jobs are implemented; no legal periods are invented here.
- The Organic Sustainability design direction and tagline “Less waste. More nourishment. Stronger communities.” are approved.

## Repository implementation snapshot

Implemented today: React/Vite health-status page and shared Axios client; Express health endpoint; MongoDB connection; environment validation; Helmet, CORS, request parsing, NoSQL sanitation and rate limiting; Socket.IO server initialization; starter health/CORS/DNS tests.

Not implemented: user authentication, organization verification, RBAC, domain models, donations, claims, pickups, evidence/image uploads, notifications, audit events, maps or product/admin workflows. Architecture documentation describes targets, not completed features.

## Documentation deliverables

The ten architecture documents are:

1. `docs/architecture/PRODUCT_REQUIREMENTS.md`
2. `docs/architecture/SYSTEM_ARCHITECTURE.md`
3. `docs/architecture/FRONTEND_ARCHITECTURE.md`
4. `docs/architecture/BACKEND_ARCHITECTURE.md`
5. `docs/architecture/DATABASE_DESIGN.md`
6. `docs/architecture/API_SPECIFICATION.md`
7. `docs/architecture/AUTH_AND_SECURITY.md`
8. `docs/architecture/UI_DESIGN_SYSTEM.md`
9. `docs/architecture/DEVELOPMENT_ROADMAP.md`
10. `docs/architecture/TESTING_STRATEGY.md`

These are aligned around one membership model, explicit state machines, private location/evidence, transactional allocation, persisted notifications, a staged implementation order and the existing layered project scaffold.

## Open implementation inputs

Before affected features are implemented, decide the approval-window value, evidence types and review checklist, launch-jurisdiction food eligibility policy, pickup timezone/slot duration/cancellation and dispute policy, suspension disposition and eligible-cancellation rules, public-location approximation precision, and records-retention/cleanup policy. The architecture documents identify these as unresolved settings; no behavior should be silently invented.

## Existing work and constraints

Application changes were already present before this documentation task. They were preserved and were not edited as part of this task. The documentation update does not change application code, dependencies, environment files or Git history. The development-only `DEV_USE_PUBLIC_DNS` workaround remains temporary and default-off; remove it after system DNS reliably resolves Atlas SRV/TXT records.

The README and Development Log contain older phase tracking and have not been reconciled. Frontend automated tests/linting are not configured. The development-only `DEV_USE_PUBLIC_DNS` workaround remains temporary and default-off; remove it after system DNS reliably resolves Atlas SRV/TXT records.

## Phase 1 implementation

### Completed

- Organic Sustainability palette tokens: forest, sage, earth, harvest, paper and ink; Fraunces display headings and Inter body text remain in use.
- Responsive public shell with brand, desktop navigation, accessible mobile menu, skip link and footer.
- Landing page with mission, clearly labeled intended workflow, donor/NGO introductions and the approved tagline. It explicitly states that publishing, claiming and partner accounts are not live.
- Reusable button, container and section-heading components; live API health status with loading, connected, database-status and retry/error states.
- React Router route table for the real home page and a not-found page. No fake auth, donor, NGO or admin routes were added.
- Reduced-motion support, visible focus treatment, semantic landmarks and responsive layout rules.
- Existing health request still uses the shared Axios client at `GET /health` against `VITE_API_URL`; backend code was not changed.

### Files created or modified

Created:

- `frontend/src/routes/AppRoutes.jsx`
- `frontend/src/components/layout/PublicLayout.jsx`
- `frontend/src/components/layout/SiteHeader.jsx`
- `frontend/src/components/layout/SiteFooter.jsx`
- `frontend/src/components/ui/ApiHealthStatus.jsx`
- `frontend/src/components/ui/Button.jsx`
- `frontend/src/components/ui/Container.jsx`
- `frontend/src/components/ui/SectionHeading.jsx`
- `frontend/src/pages/public/LandingPage.jsx`
- `frontend/src/pages/NotFoundPage.jsx`

Modified:

- `frontend/src/App.jsx`
- `frontend/src/index.css`
- `frontend/tailwind.config.js`
- `frontend/index.html`
- `PROJECT_STATUS.md`

No dependencies or backend files were changed.

### Validation

- `npm run build` — passed (Vite production build).
- Frontend tests/lint — unavailable; `package.json` defines no test or lint scripts and no frontend test framework is installed.
- API health integration — source path and response-field use preserved. Runtime request not verified because no process was listening on port 5000 during this task.
- Responsive layout — breakpoint rules for mobile, tablet and desktop are present and statically reviewed. Browser visual validation is still pending: the in-app browser timed out connecting to `127.0.0.1:5173`, and no browser automation package is installed.
- `git diff --check` — passed. Git emitted line-ending normalization warnings for modified files, but no whitespace errors.

## Recommended next step

Finish Phase 1 review by opening the frontend on the development machine at mobile, tablet and desktop widths, checking navigation and the health status with the backend available, then review the visual result and approve Phase 2 explicitly. Phase 2 has not started.
