# FoodSurplus UI Design System

## Product direction

The approved direction is Organic Sustainability: forest/sage greens, warm cream/white, earthy accents, editorial serif headings and clear sans-serif body text. Approved tagline: **“Less waste. More nourishment. Stronger communities.”** Avoid generic dashboard templates, excess gradients, neon, glassmorphism and decoration that competes with food information.

Use natural, licensed food imagery with useful alt text. Visuals must not imply that a listing is certified safe; do not add “safe”, “allergen-free” or equivalent badges unsupported by the data.

## Current foundations

Tailwind currently defines forest, emerald, paper and ink colors, with Fraunces and Inter font families. `index.css` applies paper/ink. The only screen is a centered API health-status page; shared components, role layouts, forms and semantic status tokens do not exist. Sage is part of the approved direction but is not yet a named current token. The tagline in the README is older and should be aligned in a later copy pass.

## MVP visual tokens and components

Start with a small token set: semantic text/surface/border/focus/status colors, typography scale, line-height, spacing, container widths, radii, focus ring and reduced-motion timing. Verify contrast; do not assume color names provide accessible contrast.

Build only components needed by the next workflow: Button, Field/Select, StatusMessage/ErrorSummary, Card, Dialog and Loading/Empty state. Add donation-specific cards and pickup/claim timelines when those pages arrive. Route layouts should grow from the existing `pages`, `routes` and `components/layout` scaffold; do not create a large speculative component library.

## Product-state presentation

- Show verification states `Not submitted`, `pending`, `rejected`, `approved` and organization suspension distinctly, with actionable next steps.
- Show donation states Available, Reserved, Claimed, Completed, Cancelled and Expired. Show claim Pending, Approved, Rejected, Cancelled, Expired and ExceptionReview separately from pickup state.
- Pickup states include Awaiting slot selection, Scheduled, Ready for pickup, Completed, Missed, Disputed and Cancelled. Do not overload a donation badge with pickup state.
- Public listing views show approximate location only. Exact contact/address/instructions appear only after a user has an Approved claim and server authorization succeeds.
- Unknown allergen/handling data must be labeled unknown; never infer “none” or “safe.”

## Interaction and accessibility

Use semantic landmarks, persistent labels, keyboard-operable controls, visible focus, accessible error summaries, screen-reader announcements for asynchronous claim/pickup updates and text/icons as well as color. Support reduced motion and mobile reflow. Maps, when added, must have an accessible list alternative.

Loading, empty, error, success and stale-data states must be clear. Pending claims should explain that quantity is reserved and show the approval deadline. Missed/disputed pickup states must offer only permitted recovery actions. Confirmation prompts should be reserved for consequential cancellation/administrative decisions.

## External assets and privacy

`index.html` currently loads Fraunces and Inter from Google Fonts. Review privacy, availability and self-hosting before production. Images need licensing/source tracking and responsive sizing. Do not expose exact coordinates in markup, map tiles, structured data, image metadata or public API responses.
