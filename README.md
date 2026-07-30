<div align="center">

# CareSphere

**AI-Based Student Dropout Prediction & Counseling Platform**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🎯 What is CareSphere?

CareSphere is a platform that tackles student attrition by identifying at-risk
students *before* they disengage. It consolidates fragmented academic data,
scores dropout risk, explains *why* a student is flagged, and drives
intervention through counseling workflows and parent alerts.

## 🗂️ Repository Layout

```
Student-Droupout-System/
├── frontend/          # Next.js 14 + React + Tailwind UI (role-based dashboards)
├── backend/           # FastAPI service: predictions, insights, auth, email
│   ├── app/           #   application code (routers, services, store)
│   ├── data/          #   source CSVs (loaded in-memory on startup)
│   ├── models/        #   trained RandomForest artifacts (.pkl) + report
│   └── risk_flagging.py  # optional model-training script
├── docs/              # full project documentation (see below)
└── README.md
```

## 🧠 How It Works

```
📤 Data (CSV)  →  🔄 In-memory merge  →  🤖 Risk engine + Gemini  →  📊 Dashboards  →  🔔 Parent alerts
```

- **Risk engine** — a deterministic, explainable rule engine (see
  `backend/app/services/risk_service.py`) reproduces the exact logic the
  RandomForest was trained on, and returns a 0–100 score plus contributing factors.
- **AI insights** — Google **Gemini** generates behavioral indicators,
  projections, and intervention suggestions. Without an API key it degrades
  gracefully to deterministic fallback insights.
- **Alerts** — SMTP-backed parent emails (dry-run when SMTP is unconfigured).

## 📚 Documentation

Full documentation lives in [`docs/`](docs/):

| Doc | Covers |
|-----|--------|
| [architecture.md](docs/architecture.md) | System overview, components, request flow, design decisions |
| [setup.md](docs/setup.md) | Local dev setup for backend + frontend, troubleshooting |
| [configuration.md](docs/configuration.md) | Every environment variable (backend + frontend) |
| [api-reference.md](docs/api-reference.md) | All REST endpoints with request/response examples |
| [authentication.md](docs/authentication.md) | JWT flow, roles, demo accounts, hardening |
| [risk-scoring.md](docs/risk-scoring.md) | The risk engine, thresholds, scoring, model relationship |
| [data-model.md](docs/data-model.md) | CSV schema, in-memory store, student record shape |
| [gemini.md](docs/gemini.md) | Gemini insights, config, structured output, fallback |
| [email.md](docs/email.md) | Alert types, SMTP setup, dry-run behavior |
| [deployment.md](docs/deployment.md) | Production deployment, CORS, env matrix |

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|-----------|
| Frontend   | Next.js, React, Tailwind CSS, Radix UI |
| Backend    | FastAPI, Uvicorn, Pydantic |
| AI         | Google Gemini (REST) + rule-based scoring |
| Auth       | JWT (PyJWT) with role-based accounts |
| ML (train) | Python, scikit-learn RandomForest |

---

## 🚀 Getting Started

The frontend and backend run as **two separate processes**.

### 1. Backend (FastAPI — port 8000)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows  ·  source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
copy .env.example .env            # optional — safe defaults work out of the box
python run.py
```

API: `http://localhost:8000/api` · Swagger docs: `http://localhost:8000/docs`
See [`backend/README.md`](backend/README.md) for the full endpoint reference.

### 2. Frontend (Next.js — port 3000)

```bash
cd frontend
npm install       # or: pnpm install
npm run dev
```

Open `http://localhost:3000`. The frontend calls the backend at
`http://localhost:8000/api` by default; override with `NEXT_PUBLIC_API_URL`
in `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Demo accounts (password: `password`)

| Role      | Email                   |
|-----------|-------------------------|
| Student   | student1@example.com    |
| Teacher   | teacher1@example.com    |
| Admin     | admin1@example.com      |
| Counselor | counselor1@example.com  |

---

## 👥 Role-Based Access

- 🎓 **Student** — own risk profile and recommendations
- 🧑‍🏫 **Teacher** — student roster and class analytics
- 🩺 **Counselor** — high-risk students, interventions, reports
- 🔐 **Admin** — system-wide oversight

## 🤖 Re-training the model (optional)

`backend/risk_flagging.py` trains the RandomForest and regenerates plots +
`data/final_with_risk.csv`. It needs the optional ML dependencies listed at the
bottom of `backend/requirements.txt`. The live API does **not** require them.
