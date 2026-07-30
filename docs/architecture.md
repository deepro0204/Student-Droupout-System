# Architecture

CareSphere is a two-process application: a **Next.js frontend** and a **FastAPI
backend**, developed together in one repository (a monorepo).

```
┌────────────────────────┐         HTTPS / JSON          ┌──────────────────────────┐
│   Frontend (Next.js)    │  ───────────────────────────▶ │   Backend (FastAPI)       │
│   http://localhost:3000 │   Authorization: Bearer <JWT>  │   http://localhost:8000    │
│                         │ ◀─────────────────────────── │   base path: /api          │
│  • role dashboards      │                               │                            │
│  • lib/api-client.ts    │                               │  • routers/  (endpoints)   │
│  • lib/ai-service.ts    │                               │  • services/ (logic)       │
│  • lib/email-service.tsx│                               │  • store.py  (in-memory)   │
│  • auth-provider.tsx    │                               │                            │
└────────────────────────┘                               └────────────┬───────────────┘
                                                                        │
                                        ┌───────────────────────────────┼───────────────────────────┐
                                        │                               │                           │
                                 ┌──────▼──────┐                ┌───────▼────────┐          ┌────────▼────────┐
                                 │  CSV data    │                │  Google Gemini │          │   SMTP server    │
                                 │ (in-memory)  │                │   (REST API)   │          │  (parent email)  │
                                 └──────────────┘                └────────────────┘          └──────────────────┘
```

## Components

### Frontend (`frontend/`)
- **Next.js 14 (App Router)** with React, Tailwind CSS and Radix UI.
- Renders one of four **role-based dashboards** (student / teacher / admin /
  counselor) selected in [`app/page.tsx`](../frontend/app/page.tsx).
- All backend calls go through [`lib/api-client.ts`](../frontend/lib/api-client.ts),
  which attaches the JWT from `localStorage` and normalizes errors.
- Domain clients: [`lib/ai-service.ts`](../frontend/lib/ai-service.ts) (predictions
  + insights) and [`lib/email-service.tsx`](../frontend/lib/email-service.tsx)
  (parent alerts). Session state lives in
  [`components/auth-provider.tsx`](../frontend/components/auth-provider.tsx).

### Backend (`backend/`)
- **FastAPI** app assembled in [`app/main.py`](../backend/app/main.py); every
  route is mounted under `/api`.
- **Routers** (`app/routers/`) are thin HTTP layers. **Services**
  (`app/services/`) hold the logic: `risk_service` (scoring), `gemini_service`
  (AI insights), `email_service` (SMTP).
- **`store.py`** is a singleton in-memory data store, populated once at startup
  from the CSVs and holding the seeded demo user accounts.

## Request flow (example: predict risk)

1. A client component calls `aiService.predictDropoutRisk(studentData)`.
2. `api-client` issues `POST /api/predict-dropout` with the JWT attached.
3. The `predictions` router validates the body (`PredictInput`), then
   `features.normalize()` derives the four canonical model features.
4. `risk_service.build_prediction()` computes the level, 0–100 score, factors
   and recommendations.
5. The response (`RiskPrediction`) matches the frontend's TypeScript interface
   exactly, so no client-side transformation is needed.

## Startup lifecycle

On boot, the FastAPI `lifespan` handler calls `store.load()`, which:
1. merges the four CSVs on `student_id` (`data_loader.py`),
2. computes a risk level + score for every student,
3. seeds the four demo user accounts with hashed passwords.

The dataset is held in memory for the process lifetime; there is no database.
See [data-model.md](data-model.md).

## Design decisions

- **No pandas / scikit-learn at runtime.** The trained RandomForest merely
  memorized a deterministic rule; that rule is reimplemented in pure Python
  (`risk_service`), so the API needs no heavy ML dependencies. See
  [risk-scoring.md](risk-scoring.md).
- **Graceful degradation.** Gemini and SMTP are optional. Without a Gemini key,
  insights fall back to deterministic output; without SMTP, emails run in
  dry-run mode. The API always responds successfully.
- **Contract-first responses.** Backend response models use camelCase field
  names to mirror the existing frontend interfaces.
