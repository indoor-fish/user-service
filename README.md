# user-service

Manages user lifecycle: registration, authentication, profile management, and role assignment.

## Port: 3001

## API Endpoints
- `POST /auth/register` — register a new user
- `POST /auth/login` — login and get JWT
- `POST /auth/refresh` — refresh access token
- `GET /users/:id` — get user profile
- `PUT /users/:id` — update user profile
- `DELETE /users/:id` — delete user
- `GET /admin/users` — list all users (ADMIN only)
- `PATCH /admin/users/:id/role` — change user role (ADMIN only)

## Dependencies
- `notification-service` (outbound) — publishes `user.registered` event on registration
- `@indoor-fish/shared-libs` — shared types and constants

See `BUSINESS_RULES.md` for auth business rules.
# accuracy test trigger
# reindex
# reindex
# reindex3
