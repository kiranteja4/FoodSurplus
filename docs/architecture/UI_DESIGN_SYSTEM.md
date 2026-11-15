# FoodSurplus UI Design System

## Product direction

The approved visual direction is Organic Sustainability: forest/sage greens, warm cream/white, earthy accents, editorial serif headings and clear sans-serif body text. Approved tagline: **“Less waste. More nourishment. Stronger communities.”** Avoid visuals that imply a donation is certified safe.

## Current foundations

The React/Vite application has a responsive public shell, landing page, not-found page, baseline reusable components and Tailwind design tokens. Phase 2 discovery pages are planned, not implemented.

## Phase 2 discovery presentation

- Build responsive donation listing and detail views with loading, empty, error and success states.
- Show the donor Organization's reviewed public display name and only approved fields from the explicit public DTO.
- Use exactly these food categories: Prepared Meals, Fruits & Vegetables, Bakery, Dairy Products, Packaged Food, Grains & Staples, Other.
- Render `quantity` and `availableQuantity` from decimal-string values with their `quantityUnit`; do not convert through binary floating-point values.
- Display API UTC timestamps in the browser's local timezone. The browser's clock and timezone never determine availability.
- Show availability only for records that the API returns as Available, before availableUntil, with positive availableQuantity.
- Do not display Donation status, Organization `_id`, `type` or timestamps, exact pickup address/coordinates, private contacts, pickup instructions, verification evidence, moderation details or internal claim/state data.
- Do not show maps or location discovery in Phase 2.
- Treat seed records as development/demo data; do not label them as live donor activity.

## Interaction and accessibility

Use semantic landmarks, persistent labels, keyboard-operable controls, visible focus, reduced-motion support, clear status text, and mobile/tablet/desktop reflow. Search, category, pagination and sort controls must match the documented API contract. The design must not invent food-safety assurances or handling requirements; those remain subject to policy decisions.

M0 decisions are finalized. M1 provides the canonical shared category module and models; public donation UI remains planned for a later milestone.
