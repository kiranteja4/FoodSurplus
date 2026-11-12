# FoodSurplus Frontend Architecture

## Current implementation — Phase 1

The frontend is a JavaScript React 18 application built with Vite. `src/main.jsx` mounts the app inside `BrowserRouter`; `src/App.jsx` renders the route table in `src/routes/AppRoutes.jsx`.

The implemented public route tree uses `PublicLayout`, which provides the shared `SiteHeader`, skip link, main landmark, outlet and `SiteFooter`. The root route renders `LandingPage`; the catch-all route renders `NotFoundPage`. The landing page describes the planned donor and NGO workflows and clearly states that publishing, claiming and partner accounts are not live.

Reusable UI components currently include `Button`, `Container`, `SectionHeading` and `ApiHealthStatus`. The header provides desktop navigation and a collapsible mobile menu. The public shell and landing page use responsive Tailwind classes, semantic landmarks, visible focus styling, reduced-motion rules and a skip link.

`src/api/client.js` exports the shared Axios instance, configured with `VITE_API_URL` and credential support. `ApiHealthStatus` calls `GET /health` through this client and presents loading, service/database status, error and retry states. It consumes the existing health response shape; that integration is implemented, while live runtime verification is recorded in `PROJECT_STATUS.md`.

Tailwind configuration defines the Organic Sustainability design tokens: forest, sage, earth, harvest, paper and ink colors; Fraunces display and Inter sans-serif font families; and card shadows. Global CSS supplies shared layout and component styles, focus treatment, reduced-motion behavior and page-level responsive styling.

The frontend has no configured automated test, lint or type-check scripts. React Router, Leaflet, React Leaflet and Socket.IO Client are dependencies, but Leaflet maps and Socket.IO product behavior are not implemented.

## Current frontend structure

```text
frontend/src/
  main.jsx
  App.jsx
  routes/AppRoutes.jsx
  api/client.js
  pages/public/LandingPage.jsx
  pages/NotFoundPage.jsx
  components/layout/{PublicLayout,SiteHeader,SiteFooter}.jsx
  components/ui/{ApiHealthStatus,Button,Container,SectionHeading}.jsx
  index.css
```

Extend the existing scaffold rather than replacing it. Keep API communication separate from presentation, keep domain rules on the backend, and add reusable UI when workflows establish a repeated need. Do not add a global state package or speculative component framework without a demonstrated need.

## Planned routes and features — not implemented

| Area | Proposed routes | Access rule |
|---|---|---|
| Public discovery | `/`, `/donations`, `/donations/:id` | Anonymous; only available listings and privacy-filtered public data |
| Auth | `/login`, `/register`, `/verification-status` | Public/authenticated as appropriate; no public admin creation |
| Donor | `/donor`, `/donor/donations`, `/donor/donations/new`, `/donor/claims` | Donor membership UX; API also requires approved/active organization and ownership |
| NGO | `/ngo`, `/ngo/discover`, `/ngo/claims`, `/ngo/pickups`, `/ngo/history` | NGO membership UX; API requires approved/active organization to claim |
| Admin | `/admin/verification`, `/admin/moderation`, `/admin/exceptions`, `/admin/audit` | Admin only; backend authorization is mandatory |

Only the public home route and not-found route exist today. Donation listing/detail pages, authentication, donor/NGO/admin routes and workflows are future work. Minimum admin verification must exist before donor publishing or NGO claiming. Claim review and collection history belong after those workflows exist.

## API boundary and privacy

- Reuse `src/api/client.js` for future API modules. Do not silently fall back to mock data after a real API error. Phase 2 discovery must call the real MongoDB-backed API; development seed records may supply sample database data and must not be presented as live donor activity.
- Preserve the current health response contract. New endpoints use `{ success: true, data }` and `{ success: false, error }` as defined in the API specification.
- Public donation DTOs must exclude exact coordinates, address, contact details, pickup instructions, private evidence and other non-public fields. Exact pickup details are available only to an authorized NGO with an approved claim and authorized admins.
- Exact-location approximation precision is unresolved. Do not implement location-based discovery until the project owner approves that policy.
- Discovery and workflow views must handle loading, empty, error, success and stale-data states. REST remains authoritative for notifications; Socket.IO delivery is optional future work.

## Role and workflow UX — future work

Use route guards only to improve navigation. Donor/NGO navigation should reflect the user’s single organization membership, verification state and account status, but every protected request still needs server authorization. Pending or rejected verification must explain next steps. Suspended accounts/organizations must not show actions the API will deny.

For future claims, show Pending (quantity reserved), Approved, Rejected, Cancelled, Expired and ExceptionReview distinctly. Pickup UI has separate slot selection, Scheduled, ReadyForPickup, Completed, Missed, Disputed and Cancelled states. Announce completion/dispute updates accessibly and keep them recoverable from REST.

## Accessibility and visual system

Continue the Organic Sustainability direction: forest/sage greens, warm cream/white, earthy accents, editorial serif headings and clean sans-serif body type. Verify contrast rather than relying on palette names. Use semantic landmarks, labels, keyboard-operable controls, visible focus, reduced motion, accessible error summaries and text/icons alongside state colors. Maps require an accessible list alternative.

Google Fonts currently load from a remote stylesheet. Review availability/privacy and self-hosting for production. Use licensed imagery and meaningful alt text; do not imply food safety through photography or UI badges.
