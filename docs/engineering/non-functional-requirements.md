# Non-Functional Requirements

Status: Approved for V1 planning  
Source of truth: Master Prompt V4, approved Phase 0-A docs, and approved architecture update for Tailwind/auth migration

## 1. Maintainability

- The project will use a production-like folder structure.
- Code will follow the 4-layer architecture: Presentation, Application, Domain, Infrastructure.
- Reusable UI components, hooks, services, and domain helpers will be preferred over duplicated logic.
- Business rules will be centralized in the domain layer where possible.
- Pages will compose components and call hooks or services; pages will not contain complex business logic.
- Tailwind utility classes should be composed through reusable components when patterns repeat.

## 2. Simplicity

- V1 will not use TypeScript as a mandatory requirement.
- V1 will not use Redux, microservices, Kubernetes, OAuth, real-time collaboration, plugin marketplace, AI features, mobile app, or advanced RBAC.
- V1 will not install shadcn/ui as a dependency.
- V1 will use npm.
- V1 will use Tailwind CSS v4 for styling.

## 3. Security

- Authentication will use short-lived access tokens and rotated refresh tokens.
- Access tokens will be kept in frontend memory only.
- Refresh tokens will be stored in secure HttpOnly cookies and hashed in MongoDB.
- Tokens will never be stored in localStorage or sessionStorage.
- Backend APIs will validate protected routes using the access token.
- CORS will allow credentials and use an exact origin from environment variables for refresh-cookie endpoints.
- Login, register, and refresh endpoints will be rate-limited.
- Server errors will not leak sensitive details in production.
- Secrets will be read from environment variables and never committed.

## 4. Reliability

- Environment variables will be validated at server startup.
- Required configuration mismatches will fail fast.
- Backend async errors will be routed through centralized error middleware.
- API responses will follow a consistent success and error shape.
- Logout will be idempotent.
- Refresh token rotation will revoke or replace the previous token.

## 5. Performance

- Major frontend pages will use route-based lazy loading.
- Async UI will include loading states and skeletons where useful.
- Server-state data will be cached with TanStack Query.
- Mutations will invalidate only relevant query groups.
- Analytics charts may be lazy loaded if bundle size becomes a concern.
- Tailwind CSS output should remain constrained through normal Vite/Tailwind production builds.

## 6. Accessibility

- UI will use semantic HTML.
- Forms will have labels.
- Error messages will be accessible.
- Keyboard focus states will be visible.
- Dialogs will handle focus reasonably.
- Status will not be communicated by color alone.
- Theme tokens must preserve sufficient contrast.

## 7. Compatibility

- The frontend will be built with React, Vite, and Tailwind CSS v4.
- The backend will be built with Node.js and Express.
- Data will be stored in MongoDB through Mongoose.
- The app will be self-hostable in principle, with Docker Compose stubbed in Phase 1.

## 8. Open Source Readiness

- The repository will include contribution standards before release.
- Commit messages will follow Conventional Commits.
- Changelog will follow Keep a Changelog.
- License will be MIT.
- The first release target will be `0.1.0`.

## 9. Testability

- Domain rules will be written so pure calculations can be tested without database or UI dependencies.
- Backend services will be testable independently of Express route binding where practical.
- Frontend feature behavior will be testable through React Testing Library.
- Auth tests must cover access-token expiry, refresh success, refresh failure, refresh token rotation, logout revocation, and protected route behavior.
- V1 backend services and domain logic will target 70% coverage.
