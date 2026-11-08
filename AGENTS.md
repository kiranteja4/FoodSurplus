# FoodSurplus — Project Instructions

## 1. Project Overview

FoodSurplus is a full-stack surplus food redistribution platform connecting food donors with NGOs and charitable organizations.

The platform aims to reduce food waste by helping restaurants, hotels, hostels, grocery stores and event organizers redistribute safe surplus food to organizations that can reach people in need.

Prioritize reliability, accessibility, security and usability.

## 2. Existing Technology Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Leaflet and React Leaflet
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- Zod
- JWT and bcryptjs

### Supporting tools

- Jest
- Supertest
- MongoDB Memory Server
- Cloudinary
- Git and GitHub

Do not replace existing technologies without explicit approval.

## 3. Application Roles

Design the platform around these roles:

- Donor: Publishes available surplus food.
- NGO: Discovers and claims suitable food donations.
- Administrator: Manages users, platform activity and moderation.

Implement role-based authorization on the backend. Never rely exclusively on frontend role checks.

## 4. Frontend Engineering Rules

- Use functional React components and hooks.
- Prefer reusable, modular components.
- Keep API communication separate from presentation.
- Use Axios through the existing API client where appropriate.
- Use React Router for navigation.
- Use Tailwind CSS consistently.
- Build responsive interfaces for mobile, tablet and desktop.
- Handle loading, empty, success and error states.
- Maintain accessibility and semantic HTML.
- Avoid unnecessary dependencies.

## 5. Backend Engineering Rules

- Use the existing ES module configuration.
- Keep routes, controllers, services, models, middleware and validators separated.
- Use Mongoose schemas with appropriate validation and indexes.
- Validate incoming request data using Zod or the established project convention.
- Use centralized error handling.
- Keep business logic outside route handlers.
- Use asynchronous error handling consistently.
- Never expose stack traces or internal errors to production clients.

## 6. Database Rules

- Design schemas around actual product requirements.
- Use references and indexes thoughtfully.
- Avoid unnecessary duplicate data.
- Validate relationships between users, donations and claims.
- Handle concurrent donation claims safely.
- Never assume that frontend validation guarantees database integrity.

## 7. Security Requirements

Follow OWASP security best practices.

- Hash passwords securely using bcrypt.
- Implement secure authentication and authorization.
- Validate and sanitize untrusted input.
- Protect against NoSQL injection.
- Apply rate limiting to sensitive endpoints.
- Configure CORS explicitly.
- Use secure HTTP headers.
- Protect secrets through environment variables.
- Never commit .env files.
- Validate uploaded files, their type and size.
- Restrict access to private donation and user information.
- Prevent unauthorized donation claims and status changes.
- Review all Socket.IO events for authentication and authorization.

Never disable security controls just to make an implementation work.

## 8. API Design

- Follow REST conventions.
- Use consistent endpoint naming.
- Return predictable JSON response structures.
- Use appropriate HTTP status codes.
- Document new endpoints in API_DOCUMENTATION.md.
- Validate query parameters, request bodies and route parameters.
- Apply authorization to protected resources.

## 9. Real-Time Features

Use Socket.IO for appropriate real-time functionality, including:

- Donation availability updates.
- Claim status updates.
- Relevant notifications.

Authenticate socket connections and authorize individual events.

Do not expose private information through broadcast events.

## 10. Testing Requirements

- Write tests for important business logic.
- Test authentication and authorization.
- Test API success and failure scenarios.
- Test donation claiming and concurrent updates.
- Use Jest and Supertest for backend tests.
- Verify frontend builds and linting where configured.
- Never claim tests passed without executing them.

## 11. Git Rules

- Inspect git status before modifying files.
- Never overwrite existing user work.
- Never commit .env files, credentials or secrets.
- Never perform destructive Git operations without approval.
- Never commit, push, merge or force-push without explicit permission.
- Use meaningful conventional commit messages.
- Keep changes focused and reviewable.

## 12. Development Workflow

For every substantial task:

1. Understand the requirement.
2. Inspect relevant existing files.
3. Explain the proposed implementation.
4. Identify affected files.
5. Implement in manageable steps.
6. Run relevant validation and tests when permitted.
7. Review security and edge cases.
8. Update relevant documentation.
9. Summarize changes, test results and remaining issues.

Do not implement unrelated features.

## 13. Student Learning Mode

The developer is learning full-stack development and cybersecurity.

For important implementations, explain:

- What the code does.
- Why the implementation is necessary.
- How the components communicate.
- Important design decisions.
- Security implications.
- Possible alternatives.
- Relevant technical interview questions.

Prefer educational explanations alongside production-quality implementation.

## 14. Final Rule

Correctness, security, maintainability and understanding take priority over implementation speed.
