# Configuration

All backend settings are read from environment variables (or a `backend/.env`
file) by [`app/config.py`](../backend/app/config.py) via `pydantic-settings`.
Every value has a safe development default, so the app runs with no `.env` at
all. Copy [`backend/.env.example`](../backend/.env.example) to `backend/.env`
to override.

## Backend environment variables

### General
| Variable | Default | Description |
|----------|---------|-------------|
| `ENVIRONMENT` | `development` | Free-form environment label. |
| `CORS_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated list of allowed browser origins. |

### Auth / JWT
| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | `dev-secret-change-me-in-production` | HMAC signing key for JWTs. **Change in production.** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `720` | Token lifetime (12 hours). |
| `DEMO_PASSWORD` | `password` | Password seeded for all demo accounts. |

Generate a strong secret:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Gemini (AI insights)
| Variable | Default | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | *(empty)* | Google AI Studio key. Empty ⇒ deterministic fallback insights. |
| `GEMINI_MODEL` | `gemini-2.0-flash` | Model used for `generateContent`. |
| `GEMINI_TIMEOUT_SECONDS` | `20` | Per-request timeout; on timeout the fallback is used. |

See [gemini.md](gemini.md).

### Email / SMTP
| Variable | Default | Description |
|----------|---------|-------------|
| `SMTP_HOST` | *(empty)* | SMTP server host. Empty ⇒ dry-run (emails logged, not sent). |
| `SMTP_PORT` | `587` | SMTP port. |
| `SMTP_USER` | *(empty)* | SMTP username (omit for unauthenticated relays). |
| `SMTP_PASSWORD` | *(empty)* | SMTP password / app password. |
| `SMTP_USE_TLS` | `true` | Issue `STARTTLS` before sending. |
| `FROM_EMAIL` | `noreply@caresphere.edu` | Envelope + header From address. |
| `FROM_NAME` | `CareSphere Student Support` | Display name. |

See [email.md](email.md).

## Frontend environment variables

Next.js only exposes variables prefixed with `NEXT_PUBLIC_` to the browser.
Set these in `frontend/.env.local`.

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` | Base URL of the backend API. |

## Feature flags at a glance

The `/api/health` endpoint reports which optional integrations are active:

```json
{ "status": "ok", "students_loaded": 3000, "gemini_enabled": false, "smtp_enabled": false }
```

- `gemini_enabled` is `true` when `GEMINI_API_KEY` is set.
- `smtp_enabled` is `true` when `SMTP_HOST` is set.

## Notes on `.env` file placement

- `backend/.env` is loaded by the FastAPI app (path resolved in `config.py`).
- `frontend/.env.local` is loaded by Next.js from the frontend project root.
- There is intentionally **no root `.env`** — neither framework would read it.

Both `.env` files are git-ignored; only the `*.example` templates are committed.
