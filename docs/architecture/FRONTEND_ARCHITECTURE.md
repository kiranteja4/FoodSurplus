# FoodSurplus Frontend Architecture

## Current state

The frontend contains `main.jsx`, one `App.jsx`, one Axios client and global Tailwind CSS. `main.jsx` wraps the app in `BrowserRouter`, but no routes are registered. The page calls `/health` and renders service/database status. Existing scaffold directories include `routes`, `pages`, `components/{layout,ui,donations,map,charts}`, `context`, `hooks` and `utils`; they are mostly empty. React Router, Leaflet, React Leaflet and Socket.IO Client are installed; the latter libraries are not used by product views yet.

The frontend is JavaScript, not TypeScript. Vite uses port 5173 (and may select a fallback if occupied); `VITE_API_URL` and `VITE_SOCKET_URL` are in `.env.example`. There are no frontend test/lint scripts.

## Practical structure

Extend the existing scaffold rather than replacing it:

```text
frontend/src/
  routes/                  route table and role-aware navigation UX
  pages/{public,auth,donor,ngo,admin}/
  components/{layout,ui,donations,map}/
  api/                     existing Axios client + endpoint/adaptor modules
  context/                 small auth/session context when authentication exists
  hooks/                   shared UI/data hooks
  utils/                   formatting and small pure helpers
```

Do not add a global state package or a second feature framework without demonstrated need. Keep domain rules on the backend. Reusable UI should emerge from repeated patterns rather than a large speculative component catalog.

## Routes and access

| Area | Proposed routes | Access rule |
|---|---|---|
| Public | `/`, `/donations`, `/donations/:id` | Anonymous; only available listings; approximate location and no private contact/pickup data |
| Auth | `/login`, `/register`, `/verification-status` | Public/authenticated as appropriate; no public admin creation |
| Donor | `/donor`, `/donor/donations`, `/donor/donations/new`, `/donor/claims` | Donor membership UX; API also requires approved/active organization and ownership |
| NGO | `/ngo`, `/ngo/discover`, `/ngo/claims`, `/ngo/pickups`, `/ngo/history` | NGO membership UX; API requires approved/active organization to claim |
| Admin | `/admin/verification`, `/admin/moderation`, `/admin/exceptions`, `/admin/audit` | Admin only; backend authorization is mandatory |

Routes are proposed, not present. Minimal admin verification must exist before donors publish or NGOs claim. Claim review and collection history belong after those workflows exist.

## API boundary and privacy

- Reuse `src/api/client.js`; add small endpoint modules using JavaScript objects/JSDoc as useful. Do not silently fall back to mock data after a real API error.
- If a mock adapter is used for early visual work, select it explicitly in development and keep it separate from the real API adapter. Never present mock listings as live donations.
- Normalize the current health response without changing the shape the existing page consumes. New API endpoints use `{ success: true, data }` and `{ success: false, error }`.
- Public lists/details receive only a coarse `publicLocation`, never exact coordinates, address, contact details or pickup instructions. The exact values become available only to the NGO with an Approved claim and authorized admins.
- Handle idle/loading/empty/error/success states and stale data. The REST API remains authoritative for notifications; Socket.IO is later, not MVP-required.

## Role and workflow UX

Use route guards only as UX. Donor/NGO navigation should reflect the user’s single organization membership, verification state and account status, but every protected request still receives server authorization. Pending or rejected verification must explain next steps. Suspended accounts/organizations must not show actions that the API will deny.

For claims, show Pending (quantity reserved), Approved, Rejected, Cancelled, Expired and ExceptionReview states distinctly. Pickup UI has separate slot selection, Scheduled, ReadyForPickup, Completed, Missed, Disputed and Cancelled states. A completion/dispute update must be announced accessibly and remain recoverable from REST.

## Accessibility and visual system

Keep the Organic Sustainability direction: forest/sage greens, warm cream/white, earthy accents, Fraunces-style editorial headings and clean sans-serif body type. Tailwind currently supplies forest, emerald, paper and ink tokens, but no complete semantic state/spacing system. Verify contrast rather than relying on palette names. Use semantic landmarks, labels, keyboard-operable controls, visible focus, reduced motion, accessible error summaries and text/icons in addition to state colors. Maps require a list alternative.

Google Fonts currently load from a remote stylesheet. Review availability/privacy and self-hosting for production. Use licensed imagery and meaningful alt text; do not imply food safety through photography or UI badges.
