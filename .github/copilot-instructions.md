
# GitHub Copilot Instructions — FoodSurplus

## Project Context
FoodSurplus is a full-stack surplus food redistribution platform connecting food donors with NGOs and charitable organizations.

The goal is to reduce food waste by helping donors publish surplus food and enabling NGOs to discover and claim suitable donations.

## Technology Stack

Frontend:
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Leaflet / React Leaflet
- Socket.IO Client

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- Zod
- JWT
- bcryptjs

Follow the existing project dependencies. Do not introduce new dependencies without approval.

## Architecture
- Keep frontend components reusable and modular.
- Separate API communication from UI components.
- Organize backend routes, controllers, services, models, validators and middleware.
- Keep business logic out of route handlers.
- Follow existing naming conventions and project structure.
- Avoid unnecessary abstractions.

## Frontend Standards
- Use functional React components and hooks.
- Build responsive, accessible interfaces.
- Use Tailwind CSS consistently.
- Handle loading, error, empty and success states.
- Reuse the existing Axios API client.
- Avoid duplicated UI logic.

## Backend Standards
- Use ES modules.
- Validate request bodies, parameters and query strings.
- Use centralized error handling.
- Use appropriate HTTP status codes.
- Keep API responses consistent.
- Handle asynchronous operations safely.

## Database Standards
- Use Mongoose schemas and validation.
- Add indexes where appropriate.
- Maintain data consistency.
- Handle concurrent donation claims safely.
- Never trust frontend validation alone.

## Security Standards
- Follow OWASP security best practices.
- Enforce backend authentication and authorization.
- Apply role-based access control.
- Hash passwords securely.
- Validate and sanitize untrusted input.
- Protect against NoSQL injection.
- Never expose secrets or commit .env files.
- Configure CORS and rate limiting appropriately.
- Secure file uploads.
- Authenticate and authorize Socket.IO events.

## Testing
- Write tests for important business logic.
- Test API success and failure scenarios.
- Test authorization and validation.
- Use Jest and Supertest where applicable.
- Never claim tests passed unless they were actually executed.

## Git Safety
- Never discard existing user changes.
- Never run destructive Git commands without permission.
- Never commit or push without explicit permission.
- Keep changes focused and reviewable.
- Never include credentials or environment files in commits.

## Copilot Behavior
- Understand existing code before suggesting modifications.
- Prefer minimal, maintainable changes.
- Explain important implementation decisions when asked.
- Identify security risks.
- Do not invent missing requirements.
- Do not silently change dependencies or architecture.
- Respect the project's AGENTS.md instructions.
- Focus on the code relevant to the current task.
