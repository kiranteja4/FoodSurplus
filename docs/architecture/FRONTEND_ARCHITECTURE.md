# FoodSurplus Frontend Architecture

## Current implementation

The React 18/Vite application has a public layout, landing and not-found pages, reusable baseline UI, Tailwind styles, React Router and a shared Axios client used by the API health-status component. Donation discovery pages and frontend automated testing are not implemented.

## Phase 2 pages and data flow

Add responsive public listing and detail pages within the existing `routes`, `pages`, `components` and `api` structure. Keep Axios access in a donation API module and keep rendering separate from request logic. Listing controls expose search, the seven approved food categories, pagination and deterministic sort options supported by the API. Handle loading, empty, error and success states accessibly. Use only real API responses; seeded database records are demo data, not live donor activity.

The API contract is `/api/v1/donations`; list query parameters are `page` (default 1), `limit` (default 12, max 50), optional `search`, optional `category`, and `sort` (default `soonest`). Do not send an availability parameter. Use the single category source `shared/donationCategories.mjs`. Listing and detail pages render only the approved DTO: donation `id`, `title`, `description`, `category`, decimal-string `quantity` and `availableQuantity`, `quantityUnit`, `availableUntil`, optional `foodExpiryAt`, `preparedAt`, `packedAt`, and nested Organization `name` only.

Render timestamps in the browser's local timezone while preserving their UTC API instants. Local time must not determine availability. Format decimal strings without converting through binary floating-point numbers.

## Privacy and scope

Never display or infer exact address/coordinates, private contacts, pickup instructions, verification evidence, moderation information or claim/state information from public responses. Do not build a map or location-based discovery until public location precision is approved. Phase 2 has no authentication, registration, donor publishing, claims, reservation, pickup scheduling, admin dashboard, uploads, Cloudinary or Socket.IO notifications. Do not add speculative role routes.

Use the existing design system and semantic controls. Preserve keyboard access, visible focus, reduced motion and mobile/tablet/desktop reflow. Organization `name` is the sole public Organization field; never render Organization `_id`, `type`, or timestamps. M0 decisions are finalized. Vite now allows only the frontend root and shared module directory for development-server file access; no donation UI is part of M1.
