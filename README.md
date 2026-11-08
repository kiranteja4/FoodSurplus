# FoodSurplus
**Reducing Food Waste. Connecting Surplus with Those in Need.**

A full-stack platform connecting food donors (restaurants, hotels, hostels, stores, event organizers) with NGOs.

## Stack
React + Vite + Tailwind | Node + Express + Socket.IO | MongoDB + Mongoose | JWT + bcrypt

## Quick start

### 1. Backend
```bash
cd backend
cp .env.example .env      # Windows: copy .env.example .env
# edit .env: set MONGODB_URI and two long random secrets
npm install
npm run dev
```
Check it works: open http://localhost:5000/api/v1/health

### 2. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173

## Getting credentials
- **MongoDB Atlas (free):** create account at mongodb.com/atlas, create a free cluster, add a database user, allow your IP, copy the connection string into `MONGODB_URI`.
- **Cloudinary (needed from Phase 6):** create account at cloudinary.com, copy cloud name, API key and API secret from the dashboard.
- **JWT secrets:** run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` twice.

## Progress checklist
- [x] Phase 1: Architecture
- [x] Phase 2: Project setup
- [ ] Phase 3: Database and backend foundation
- [ ] Phase 4: Authentication
- [ ] Phase 5: Frontend foundation
- [ ] Phase 6-12: see PROJECT_ARCHITECTURE.md
