# Database Schema

This document details the MongoDB schemas, data models, and indexes implemented for FoodSurplus Phase 2 (Milestone M1 & M2).

## Collections & Schemas

### 1. `organizations` Collection
Minimal organization profile model for Phase 2 public display.

- **Mongoose Model**: `Organization` (`backend/src/models/Organization.js`)
- **Fields**:
  - `_id`: `ObjectId` (MongoDB default primary key)
  - `name`: `String` (required, trimmed) — The public display name of the donor organization
  - `type`: `String` (required, trimmed, unrestricted string in Phase 2) — Organization type (e.g., 'Supermarket', 'Bakery', 'Hospitality')
  - `createdAt`: `Date` (managed by Mongoose `timestamps: true`)
  - `updatedAt`: `Date` (managed by Mongoose `timestamps: true`)
- **Indexes**:
  - `_id_`: Default MongoDB primary key index

---

### 2. `donations` Collection
Donation listings representing surplus food available for redistribution.

- **Mongoose Model**: `Donation` (`backend/src/models/Donation.js`)
- **Fields**:
  - `_id`: `ObjectId` (MongoDB default primary key)
  - `title`: `String` (required, trimmed) — Descriptive title of the food surplus
  - `description`: `String` (required, trimmed) — Detailed description of contents and packaging
  - `category`: `String` (required, enum) — Controlled food category from `shared/donationCategories.mjs`:
    - `Prepared Meals`
    - `Fruits & Vegetables`
    - `Bakery`
    - `Dairy Products`
    - `Packaged Food`
    - `Grains & Staples`
    - `Other`
  - `quantity`: `Decimal128` (required, validated via `quantity.js`) — Total quantity donated
  - `availableQuantity`: `Decimal128` (required, validated via `quantity.js`, must be `<= quantity`) — Remaining quantity
  - `quantityUnit`: `String` (required, enum) — `kg`, `g`, `L`, `mL`, `servings`, `packets`
  - `availableUntil`: `Date` (required) — Expiration timestamp for public discovery eligibility
  - `foodExpiryAt`: `Date` (optional) — Food safety expiration timestamp
  - `preparedAt`: `Date` (optional) — Timestamp when prepared
  - `packedAt`: `Date` (optional) — Timestamp when packed
  - `organization`: `ObjectId` (required, ref: `'Organization'`) — Reference to the publishing organization
  - `status`: `String` (required, enum: `['Available']`, default: `'Available'`) — Phase 2 status
  - `createdAt`: `Date` (managed by Mongoose `timestamps: true`)
  - `updatedAt`: `Date` (managed by Mongoose `timestamps: true`)

- **Indexes**:
  1. `status_1_availableUntil_1_createdAt_-1__id_1`:
     - **Definition**: `{ status: 1, availableUntil: 1, createdAt: -1, _id: 1 }`
     - **Purpose**: Powers default public discovery feed (`GET /api/v1/donations`).
     - **Sort Coverage**: Provides complete non-blocking index sort coverage for `{ availableUntil: 1, createdAt: -1, _id: 1 }` starting from `availableUntil > serverNow`.
  2. `category_1_status_1_availableUntil_1_createdAt_-1__id_1`:
     - **Definition**: `{ category: 1, status: 1, availableUntil: 1, createdAt: -1, _id: 1 }`
     - **Purpose**: Powers category-filtered discovery (`GET /api/v1/donations?category=...`).
     - **Sort Coverage**: Provides complete non-blocking index sort coverage for `{ availableUntil: 1, createdAt: -1, _id: 1 }` within a specific category.
  3. `title_text_description_text`:
     - **Definition**: `{ title: 'text', description: 'text' }`
     - **Purpose**: Powers keyword text search queries (`$text`) over title and description without unindexed regex table scans.

---

## Development Seed Data Specification (Milestone M2)

- **Entry Point**: `node backend/scripts/seed.js` or `npm run seed --prefix backend`
- **Dataset**:
  - 4 Organizations (Supermarket, Artisan Bakery, Hospitality, Dairy Producer)
  - 18 Demo Donations covering all 7 categories and all 6 quantity units
- **Safety**:
  - Synchronous pre-import check aborts in production (`NODE_ENV === 'production'`) before any DB connection.
  - Deterministic fixed `_id` values.
  - Insert-only upsert: compares existing document payloads against the manifest.
  - Exact match skips; conflicting payload raises `SeedCollisionError` without overwriting or deleting records.
  - Zero deletion policy: never calls `deleteMany`, `deleteOne`, or `drop`.
