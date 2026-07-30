# Local Development Setup

The frontend and backend run as **two separate processes**. Start the backend
first (the frontend calls it on port 8000).

## Prerequisites

| Tool     | Version | Notes |
|----------|---------|-------|
| Python   | 3.11+   | Verified on 3.14. Only prebuilt wheels are used — no compiler needed. |
| Node.js  | 18+     | For the Next.js frontend. |
| npm/pnpm | any     | `pnpm-lock.yaml` is present; `npm install` also works. |

## 1. Backend (FastAPI · port 8000)

```bash
cd backend
python -m venv .venv

# activate the venv
.venv\Scripts\activate          # Windows PowerShell / cmd
# source .venv/bin/activate     # macOS / Linux

pip install -r requirements.txt

# optional — create a .env to override defaults (Gemini key, SMTP, secret)
copy .env.example .env          # Windows
# cp .env.example .env          # macOS / Linux

python run.py                   # or: uvicorn app.main:app --reload --port 8000
```

Verify it's up:

```bash
curl http://localhost:8000/api/health
# {"status":"ok","students_loaded":3000,"gemini_enabled":false,"smtp_enabled":false}
```

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

The API works out of the box with **no `.env`** — Gemini falls back to
deterministic insights and email runs in dry-run mode. See
[configuration.md](configuration.md) to enable them.

## 2. Frontend (Next.js · port 3000)

In a second terminal:

```bash
cd frontend
npm install          # or: pnpm install
npm run dev
```

Open <http://localhost:3000> and sign in with a demo account (see
[authentication.md](authentication.md)).

### Pointing the frontend at a different backend

By default the frontend calls `http://localhost:8000/api`. To override, create
`frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Restart `npm run dev` after changing it (Next.js reads env at startup).

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Login fails with a network error | Backend isn't running, or `NEXT_PUBLIC_API_URL` is wrong. |
| CORS error in the browser console | Add the frontend origin to `CORS_ORIGINS` in `backend/.env`. |
| `401 Invalid or expired token` | Token expired (12 h default) — log out and back in. |
| Insights say `"source": "fallback"` | No `GEMINI_API_KEY` set — expected without a key. |
| Emails never arrive | SMTP not configured — responses include `"dry_run": true`. |
| `pip install` compiles from source | Upgrade pip (`python -m pip install -U pip`) so it finds wheels. |

## Re-training the ML model (optional)

Only needed if you want to regenerate the RandomForest artifacts / plots. The
live API does not use them.

```bash
cd backend
pip install pandas scikit-learn matplotlib seaborn joblib
python risk_flagging.py
```

See [risk-scoring.md](risk-scoring.md) for how the model relates to the runtime
rule engine.
