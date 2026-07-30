# CareSphere Backend (FastAPI)

AI-based student dropout prediction & counseling API. Serves risk predictions,
Gemini-powered insights, roster analytics, JWT auth, and parent email alerts.

- **Data:** the four CSVs in [`data/`](data/) are merged and loaded **in memory**
  on startup (stdlib `csv` — no pandas).
- **Risk scoring:** deterministic, explainable rule engine in
  [`app/services/risk_service.py`](app/services/risk_service.py). It reproduces the
  exact rule the RandomForest in [`risk_flagging.py`](risk_flagging.py) was trained
  on, so no `scikit-learn` runtime dependency is required.
- **AI insights:** Google **Gemini** via REST
  ([`app/services/gemini_service.py`](app/services/gemini_service.py)); falls back to
  deterministic insights when `GEMINI_API_KEY` is unset.
- **Email:** SMTP ([`app/services/email_service.py`](app/services/email_service.py));
  runs in dry-run mode when `SMTP_HOST` is unset.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows  (source .venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
copy .env.example .env            # optional; safe defaults work out of the box
```

## Run

```bash
python run.py
# or:  uvicorn app.main:app --reload --port 8000
```

- API base URL: `http://localhost:8000/api`
- Interactive docs (Swagger): `http://localhost:8000/docs`

## Auth

Four seeded demo accounts (password = `password`, configurable via `DEMO_PASSWORD`):

| Email                     | Role      |
|---------------------------|-----------|
| student1@example.com      | student   |
| teacher1@example.com      | teacher   |
| admin1@example.com        | admin     |
| counselor1@example.com    | counselor |

`POST /api/auth/login` returns a JWT; send it as `Authorization: Bearer <token>`
on all protected routes.

## Endpoints

| Method | Path                          | Auth | Description |
|--------|-------------------------------|------|-------------|
| GET    | `/api/health`                 | no   | Service + feature-flag status |
| POST   | `/api/auth/login`             | no   | Email/password → JWT + user |
| GET    | `/api/auth/me`                | yes  | Current user |
| GET    | `/api/students`               | yes  | Paginated roster (`skip`,`limit`,`risk`,`search`) |
| GET    | `/api/students/{id}`          | yes  | One student + computed risk |
| GET    | `/api/analytics/summary`      | yes  | Risk distribution, averages, per-class counts |
| POST   | `/api/predict-dropout`        | yes  | Risk prediction for one student |
| POST   | `/api/predict-dropout/batch`  | yes  | Risk prediction for many |
| POST   | `/api/student-insights`       | yes  | Gemini insights (fallback if no key) |
| POST   | `/api/email/send-alert`       | yes  | Send one parent alert |
| POST   | `/api/email/bulk-alerts`      | yes  | Send high-risk alerts in bulk |

`/predict-dropout` and `/student-insights` accept flexible input: raw features
(`attendance_percent`, `avg_marks`, `failed_attempts`, `fee_paid_percent`), a
`student_id` that resolves against the loaded roster, or the frontend
`StudentData` shape (`gpa`, `attendance`, `feeStatus`, `subjects`).

## Re-training the model (optional)

[`risk_flagging.py`](risk_flagging.py) trains the RandomForest and writes plots +
`data/final_with_risk.csv`. It needs the optional ML deps (commented at the bottom
of `requirements.txt`): `pip install pandas scikit-learn matplotlib seaborn joblib`.
The live API does **not** need them.
