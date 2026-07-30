# Authentication & Authorization

Auth is JWT-based. Logic lives in
[`app/security.py`](../backend/app/security.py) and
[`app/routers/auth.py`](../backend/app/routers/auth.py); the frontend session is
managed by [`components/auth-provider.tsx`](../frontend/components/auth-provider.tsx).

## Demo accounts

Seeded in memory at startup (password configurable via `DEMO_PASSWORD`,
default `password`):

| Role      | Email                    | `studentId` |
|-----------|--------------------------|-------------|
| Student   | student1@example.com     | `1`         |
| Teacher   | teacher1@example.com     | –           |
| Admin     | admin1@example.com       | –           |
| Counselor | counselor1@example.com   | –           |

## Flow

```
1. POST /api/auth/login { email, password }
       │
       ▼
2. Backend verifies the pbkdf2 hash, issues a signed JWT
       │  { access_token, token_type: "bearer", user }
       ▼
3. Frontend stores token + user in localStorage (api-client.setToken)
       │
       ▼
4. Every subsequent request carries  Authorization: Bearer <token>
       │
       ▼
5. get_current_user() decodes the JWT and loads the user, or returns 401
```

## Token details

- **Algorithm:** HS256, signed with `SECRET_KEY`.
- **Claims:** `sub` (email), `role`, `iat`, `exp`.
- **Lifetime:** `ACCESS_TOKEN_EXPIRE_MINUTES` (default 720 = 12 h).
- On decode failure or unknown user, protected routes return
  `401 { "detail": "Invalid or expired token" }`.

## Password hashing

Passwords are hashed with **PBKDF2-HMAC-SHA256** (200,000 rounds, per-password
random salt) using only the Python standard library — no native bcrypt build
required. Stored as `"<salt_hex>$<digest_hex>"`; verification uses a
constant-time comparison.

## Protected vs public routes

| Public | Protected (Bearer required) |
|--------|-----------------------------|
| `GET /`, `GET /api/health`, `POST /api/auth/login` | everything else, incl. `/auth/me`, `/students*`, `/analytics/*`, `/predict-dropout*`, `/student-insights`, `/email/*` |

Protection is applied per-route with the `get_current_user` FastAPI dependency.

## Role-based access

Roles (`student`, `teacher`, `admin`, `counselor`) are carried in the JWT and
the user object, and the frontend routes each role to its dashboard in
[`app/page.tsx`](../frontend/app/page.tsx). The current endpoints authorize by
*authentication* (valid token) rather than by role. To enforce role checks
server-side, add a dependency that inspects `current_user["role"]` on the
relevant routers.

## Production hardening

- Set a strong `SECRET_KEY` (`python -c "import secrets; print(secrets.token_hex(32))"`).
- Replace the seeded demo users with a real user store and unique passwords.
- Consider shorter token lifetimes + refresh tokens, and storing the token in
  an httpOnly cookie instead of `localStorage` to reduce XSS exposure.
