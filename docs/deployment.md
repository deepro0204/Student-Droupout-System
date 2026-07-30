# Deployment

CareSphere deploys as two independent services: a Next.js frontend and a
FastAPI backend. Host them separately and point the frontend at the backend's
public URL.

## Overview

```
[ Browser ] ──▶ [ Frontend: Next.js (Vercel/Node) ] ──▶ [ Backend: FastAPI (Uvicorn) ] ──▶ Gemini / SMTP
```

## Backend (FastAPI)

Run under an ASGI server. For production use multiple workers and drop
`--reload`:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Production checklist:
- Set a strong `SECRET_KEY`.
- Set `CORS_ORIGINS` to your real frontend origin(s) — not `localhost`.
- Configure `GEMINI_API_KEY` and SMTP if you want live AI/email.
- Terminate TLS at a reverse proxy (nginx / Caddy / cloud LB) in front of Uvicorn.
- `ENVIRONMENT=production`.

### Container sketch

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

> The CSVs in `backend/data/` are read at startup, so they must ship inside the
> image / deployment artifact. Since state is in memory, the service is
> stateless and horizontally scalable (each replica loads its own copy).

## Frontend (Next.js)

Build and serve:

```bash
cd frontend
npm install
npm run build
npm run start          # or deploy to Vercel
```

Set the backend URL as a build-time public env var (Vercel project settings or
`frontend/.env.production`):

```
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
```

`NEXT_PUBLIC_*` values are inlined at build time — rebuild after changing them.

## CORS

The backend must allow the frontend origin. Example `backend/.env`:

```
CORS_ORIGINS=https://app.your-domain.com
```

Multiple origins are comma-separated.

## Environment matrix

| Concern | Backend var | Frontend var |
|---------|-------------|--------------|
| API location | – | `NEXT_PUBLIC_API_URL` |
| Allowed origins | `CORS_ORIGINS` | – |
| JWT secret | `SECRET_KEY` | – |
| AI | `GEMINI_API_KEY`, `GEMINI_MODEL` | – |
| Email | `SMTP_*`, `FROM_*` | – |

## Beyond the prototype

The current backend is stateless with an in-memory, read-only dataset. Before a
real production rollout, consider:
- a persistent database (see [data-model.md](data-model.md#persistence-caveat)),
- a real user directory + role enforcement
  (see [authentication.md](authentication.md#production-hardening)),
- a durable queue for email sending (see [email.md](email.md#delivery-semantics)),
- request logging, metrics, and health/readiness probes for orchestration.
