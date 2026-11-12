# FoodSurplus

**Less waste. More nourishment. Stronger communities.**

FoodSurplus is an early-stage portfolio project exploring how restaurants, hotels, grocers, caterers and other food donors can connect edible surplus with NGOs and community organizations able to collect it.

## The problem

Edible surplus can go unused when donors lack a straightforward way to share availability and local organizations cannot discover suitable food in time. FoodSurplus is being built to support that connection with clear food, handling and collection information.

## Intended workflow

1. **Donors** publish surplus food with quantity, preparation, handling, storage and collection details.
2. **NGOs and community organizations** discover available listings and request suitable donations.
3. **Donors and NGOs** coordinate an approved claim and a collection.
4. **Administrators** verify organizations and handle moderation and exceptions.

This is the planned product workflow. Publishing, discovery, claiming, organization verification and administrator workflows are not live features yet. The current application is a public landing page and API health-status foundation; see [Project status](PROJECT_STATUS.md).

## Current status

- Phase 0 architecture consolidation: completed.
- Phase 1 design system and public frontend foundation: completed.
- Phase 2 — Public Experience & Real Donation Discovery: awaiting explicit approval; not started.

The Phase 2 plan calls for real MongoDB-backed listing/detail APIs, with development-only seeded records as sample data. It does not include donor publishing. Location-based discovery depends on an owner decision about public location approximation precision.

## Technology

### Implemented foundation

- Frontend: React 18, Vite, Tailwind CSS, React Router, Axios.
- Backend: Node.js, Express, Mongoose, MongoDB, Socket.IO server initialization.
- Backend foundation controls: Zod environment validation, Helmet, CORS, request parsing, MongoDB sanitization and API rate limiting.
- Tests: Jest and Supertest starter backend tests.

### Installed for planned work

JWT, bcryptjs, Cloudinary, Multer, Leaflet/React Leaflet, Socket.IO Client, MongoDB Memory Server and other packages are present in package manifests. Authentication, uploads, maps, domain models, realtime events and the related product workflows are not implemented. See the [architecture documentation](docs/architecture/).

## Repository structure

```text
backend/
  src/config/       environment, database, CORS and DNS configuration
  src/routes/       current health route
  src/middleware/   error handling and app middleware integration
  tests/            health, CORS and development DNS tests
frontend/
  src/api/          shared Axios client
  src/components/   public layout and reusable UI
  src/pages/        landing and not-found pages
  src/routes/       React Router table
docs/architecture/  product, system, API, data, security, UI and test plans
```

The architecture documents describe planned target behavior separately from the current implementation.

## Local setup

### Requirements

- Node.js and npm.
- A MongoDB instance accessible to the backend (local MongoDB or MongoDB Atlas).

The repository does not currently declare a Node.js version requirement.

### Backend

In PowerShell:

```powershell
cd backend
npm ci
Copy-Item .env.example .env
```

Edit `backend/.env` and set `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`. The JWT values must each be at least 32 characters. These settings are validated now even though authentication is planned and not implemented. Keep `.env` private; commit only `.env.example`.

Start the API:

```powershell
npm run dev
```

The server connects to MongoDB before listening. Check `http://localhost:5000/api/v1/health`.

### Frontend

Open a second PowerShell terminal:

```powershell
cd frontend
npm ci
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5173`. The frontend `.env` sets `VITE_API_URL` for the health request. Values prefixed with `VITE_` are bundled into browser code; never put secrets in frontend environment variables. `VITE_SOCKET_URL` is present as a planned configuration value and is not currently used by product functionality.

### Environment files

The backend example documents `NODE_ENV`, `PORT`, `DEV_USE_PUBLIC_DNS`, `CLIENT_URL`, `MONGODB_URI`, JWT configuration and optional Cloudinary settings. The frontend example contains API and Socket.IO URL settings. Copy the examples locally, replace placeholders only in ignored `.env` files, and never commit real credentials. Cloudinary credentials are not currently used by product features.

`DEV_USE_PUBLIC_DNS` is a temporary, development-only Windows workaround for Atlas DNS resolution and defaults off. Do not enable it in test or production. Remove it after system DNS resolves Atlas SRV/TXT records.

## Development commands

Run commands from the indicated directory. These commands match scripts currently defined in each `package.json`.

| Directory | Command | Purpose |
|---|---|---|
| `backend` | `npm run dev` | Start the backend with nodemon |
| `backend` | `npm start` | Start the backend with Node.js |
| `backend` | `npm test` | Run the Jest backend test suite |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Create the Vite production build |
| `frontend` | `npm run preview` | Preview the built frontend locally |

There are no frontend test, lint or type-check scripts configured. Backend health tests have not yet been verified in the normal local environment after the audit sandbox encountered `EACCES` binding a local port; see [Project status](PROJECT_STATUS.md).

## Documentation

- [Project status](PROJECT_STATUS.md)
- [Development log](DEVELOPMENT_LOG.md)
- [Development roadmap](docs/architecture/DEVELOPMENT_ROADMAP.md)
- [Product requirements](docs/architecture/PRODUCT_REQUIREMENTS.md)
- [System architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Frontend architecture](docs/architecture/FRONTEND_ARCHITECTURE.md)
- [Backend architecture](docs/architecture/BACKEND_ARCHITECTURE.md)
- [Database design](docs/architecture/DATABASE_DESIGN.md)
- [API specification — planned contracts](docs/architecture/API_SPECIFICATION.md)
- [Authentication and security design](docs/architecture/AUTH_AND_SECURITY.md)
- [UI design system](docs/architecture/UI_DESIGN_SYSTEM.md)
- [Testing strategy](docs/architecture/TESTING_STRATEGY.md)
- [Current API behavior](API_DOCUMENTATION.md)
- [Current architecture overview](PROJECT_ARCHITECTURE.md)
- [Security notes](SECURITY.md)

## Contributing

FoodSurplus is at an early foundation stage. Before starting substantial work, check the current status and roadmap and open an issue or discussion to agree on scope. Keep contributions focused, preserve the documented product and privacy decisions, update relevant documentation, and run the existing checks for the affected area. Do not commit environment files, credentials, private verification material or real personal data. There is no contributor license agreement or release process documented at this stage.

## License

**No license has been selected.** Public visibility alone does not grant permission to reuse, modify or distribute this project. The owner should select and add a license before inviting reuse.
