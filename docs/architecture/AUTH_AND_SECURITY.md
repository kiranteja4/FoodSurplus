# FoodSurplus Authentication and Security

## Current controls and gaps

The scaffold has Helmet, explicit credentialed CORS, JSON body limit, cookie parsing, `express-mongo-sanitize`, an API-wide rate limit, Zod environment parsing and centralized error handling. It has no user model, password hashing flow, JWT issue/validation, refresh sessions, CSRF protection, RBAC/ownership middleware, upload security, Socket.IO auth or audit events. Current tests do not test auth.

## Identity and membership

- A normal account has one Donor or NGO membership to one organization in the MVP. Store it as a relationship so multiple memberships can be added later.
- Admin is a separately provisioned system role; no public endpoint accepts or creates admin roles.
- Both organization types have verification state (`notSubmitted`, `pending`, `approved`, `rejected`) and separate operational state (`active`, `suspended`). Rejection permits corrected resubmission.
- Each request resolves current user, membership and organization status. A signed JWT’s role or status claims are not sufficient because organizations can be suspended and users disabled while tokens remain unexpired.
- Only approved, active donors publish; only approved, active NGOs claim. Suspension blocks new operations and routes approved claims to authorized exception resolution.

## Access and refresh-token lifecycle

Approved MVP approach:

1. On login, issue a short-lived signed access JWT in the JSON response. Keep it in frontend memory and send it in the `Authorization: Bearer` header; never put it in local storage.
2. Issue a longer-lived refresh token in a narrowly scoped `HttpOnly` cookie. Persist only a hash/JTI and family/session metadata in `RefreshSession`; never persist or log the raw token.
3. Refresh atomically verifies the current session, revokes it and creates a replacement in the same family. If a revoked token is reused, revoke the whole family and require sign-in again.
4. Logout revokes the current session and clears the cookie. Password reset, account disablement, role/membership change and security action revoke affected sessions and increment `authVersion`.
5. Protected requests validate signature/issuer/audience/expiry/purpose, then check current account and membership/organization state. Use short access lifetime plus `authVersion`/session checks so suspension takes effect promptly.

`jsonwebtoken`, `bcryptjs` and `cookie-parser` are already dependencies; no new auth dependency is required. The existing example access lifetime is 15 minutes; final lifetimes should be configured and reviewed before release.

## Cookie, CSRF and deployment-origin requirements

- Cookies use `HttpOnly`, `Secure` in production, narrow `Path`/`Domain`, and an explicit `SameSite` policy. Never weaken production cookie settings for local HTTP development.
- The frontend/API deployment topology is not yet decided. Prefer same-site origins. For same-site deployments, use the approved `SameSite` value after review; truly cross-site deployment requires `SameSite=None; Secure` and stricter CSRF/CORS controls.
- Refresh and logout consume cookies and require CSRF protection plus exact allowed `Origin`/`Referer` validation. Use a synchronizer or correctly signed double-submit token; `SameSite` and CORS alone are not the complete CSRF design.
- The current Axios client sets `withCredentials: true`. Keep credentialed CORS allowlisted; do not use `*` with credentials.
- Never trust frontend route guards, submitted organization IDs, roles, verification state or ownership.

## Verification evidence and uploads

- Donor and NGO evidence is private. Store evidence references and review state in `VerificationSubmission`; use a private Cloudinary asset/folder policy and short-lived admin access. Do not expose evidence via public organization/listing DTOs or notifications.
- Donation images may be publicly visible only after authorization and file validation. Check size, allowed extension/MIME and content signature; generate storage names, avoid trusting client metadata, strip location metadata where appropriate, and keep Cloudinary secrets server-side.
- Do not reuse public donation-image delivery settings for private evidence. Do not issue broad or long-lived Cloudinary credentials to the browser.

## Food, location and database safety

- Validate request params/query/body with Zod and model constraints in Mongoose. Use allowlisted query fields; do not concatenate user input into Mongo queries. Retain `express-mongo-sanitize` as defense-in-depth.
- Unknown handling history or insufficient mandatory preparation/storage/collection information is ineligible. Preserve explicit unknown allergen status; do not describe it as allergen-free or safe.
- Public listing/map DTOs contain approximate location only. Exact coordinates/address, contact details and pickup instructions are available only to the NGO with an Approved claim and authorized admins.
- Claim operations use conditional state updates and Mongo transactions; do not use read-then-write allocation.

## Authorization and rate limiting

Enforce role, membership, organization verification/active state, ownership and state transition on every request. Admin decisions, suspensions and exception resolution are explicit admin-only operations and audited. The global `/api` limit is 300/15 minutes; add narrower login, registration, refresh, evidence/image upload and expensive-search limits. Configure proxy trust narrowly. A shared limiter store is a future scaling need, not a new MVP dependency.

## Notifications, Socket.IO and audit

- MVP notifications are in-app MongoDB records, one per recipient user, with read state and history. No email/SMS. REST is authoritative.
- Socket.IO has no feature events today and is deferred. When added, authenticate the handshake, authorize rooms/events against current membership, send minimal notices only after commit, and never broadcast private location/evidence data.
- Audit verification submissions/decisions, suspension/reactivation, moderation and exception resolution. Keep safe changed fields/reason/actor/target; never log passwords, tokens, cookies, connection strings or unnecessary food/user PII.
- Treat app-level append-only behavior as insufficient alone; restrict database permissions and define retention. Do not invent legal periods or enable TTL cleanup before policy approval.

## Environment and operations

`.env` and `.env.*` are ignored; examples contain placeholders. `DEV_USE_PUBLIC_DNS` is a temporary Windows development-only workaround, default off and rejected outside development. Remove it when platform/system DNS resolves Atlas SRV/TXT reliably; never enable public DNS overrides in test/production.

Before deployment, define production log redaction, HTTPS/proxy behavior, secrets rotation, least-privilege Atlas accounts, backup/restore, graceful shutdown, health/readiness checks and incident response. The current application does not implement these operational controls fully.
