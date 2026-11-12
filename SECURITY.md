# Security Policy

FoodSurplus is an early-stage academic and portfolio project. Its current backend is a foundation, not a production service. Security controls described as planned below are not implemented application guarantees.

## Reporting a vulnerability

Please do not publish exploitable vulnerability details in a public issue or discussion. If GitHub Private Vulnerability Reporting is enabled for this repository, use its private reporting flow. If it is unavailable, contact the repository owner through the [FoodSurplus GitHub profile](https://github.com/kiranteja4) and ask for a private channel before sharing technical details.

Include the affected component, impact, and steps to reproduce using a local or test environment. Do not include real credentials, personal data, private verification evidence or production data. Please allow the owner time to investigate and coordinate a fix before public disclosure. No response-time or supported-version commitment has been established.

## Controls currently present

- Environment configuration is parsed with Zod. MongoDB URI and JWT secret settings are required; configured JWT secrets must be at least 32 characters. JWT authentication itself is not implemented.
- `.env` and `.env.*` files are ignored by Git, with `.env.example` retained as a placeholder template.
- Helmet is applied by the Express app.
- Credentialed CORS allows the configured `CLIENT_URL`; non-production environments also allow localhost and loopback origins.
- JSON request bodies are limited to 10 KB.
- `express-mongo-sanitize` is applied to requests.
- A global rate limit is applied to `/api` (300 requests per 15 minutes per limiter key).
- Centralized error handling returns generic messages for unhandled server errors outside development.
- `DEV_USE_PUBLIC_DNS` defaults off and is accepted only in development.

These controls have only the scope described above. For example, CORS is not authorization, the global rate limit is not a sensitive-endpoint-specific policy, and environment validation does not implement authentication.

## Not yet implemented

- User authentication, password handling, JWT issuance/validation, refresh sessions and CSRF protection.
- Role-based access control, organization verification, ownership checks and private-resource authorization.
- Product request validation, donation/claim workflows, domain models and transaction rules.
- Upload validation and private verification-evidence storage/access controls.
- Authentication and authorization for Socket.IO events.
- Production log redaction, deployment hardening, secret rotation procedures, backup/restore and incident-response procedures.

The planned controls and requirements are described in [Authentication and security architecture](docs/architecture/AUTH_AND_SECURITY.md) and [Testing strategy](docs/architecture/TESTING_STRATEGY.md). Do not treat those target designs as implemented features. Food eligibility and handling requirements are not a food-safety certification or guarantee.

## Safe handling

- Keep real environment files and credentials out of Git. Never put secrets in frontend `VITE_` variables; they are exposed to browser code.
- Use only placeholder values in examples and documentation.
- Do not submit real user data or private verification material in issues, pull requests, screenshots or test fixtures.
- Set `NODE_ENV=production` explicitly in deployed environments. The current backend defaults it to development when unset; development behavior includes loopback CORS allowances and development error details.
