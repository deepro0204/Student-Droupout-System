# API Reference

Base URL: `http://localhost:8000/api`
Interactive docs: `http://localhost:8000/docs` (Swagger) · `/redoc`

All responses are JSON. Protected endpoints require a JWT:

```
Authorization: Bearer <access_token>
```

Errors use the standard FastAPI shape: `{ "detail": "<message>" }` with an
appropriate HTTP status (`401` unauthenticated, `404` not found, `422`
validation error).

---

## Health

### `GET /` (root, unauthenticated)
```json
{ "service": "CareSphere API", "status": "ok", "docs": "/docs", "students_loaded": 3000 }
```

### `GET /api/health` (unauthenticated)
```json
{ "status": "ok", "students_loaded": 3000, "gemini_enabled": false, "smtp_enabled": false }
```

---

## Authentication

### `POST /api/auth/login` (unauthenticated)
Request:
```json
{ "email": "counselor1@example.com", "password": "password" }
```
Response `200`:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": { "id": "4", "name": "Counselor1", "email": "counselor1@example.com", "role": "counselor", "studentId": null }
}
```
Response `401`: `{ "detail": "Invalid email or password" }`

### `GET /api/auth/me` (protected)
Returns the current user (`UserOut`). `401` if the token is missing/expired.

See [authentication.md](authentication.md) for the full auth model.

---

## Students & Analytics

### `GET /api/students` (protected)
Query parameters:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `skip` | int ≥ 0 | `0` | Offset for pagination. |
| `limit` | int 1–500 | `50` | Page size. |
| `risk` | string | – | Filter by `Low` / `Medium` / `High`. |
| `search` | string | – | Match name, id, or class (case-insensitive). |

Response `200`:
```json
{
  "total": 468,
  "skip": 0,
  "limit": 2,
  "items": [
    {
      "id": 1, "name": "Student_1", "class": "CIVIL",
      "parent_name": "Parent_1", "parent_email": "parent1@mail.com",
      "attendance_percent": 74.0, "avg_marks": 40.0,
      "failed_attempts": 3, "fee_paid_percent": 59.0,
      "riskLevel": "High", "riskScore": 60
    }
  ]
}
```

### `GET /api/students/{id}` (protected)
Returns a single `Student`, or `404` if the id is not in the roster.

### `GET /api/analytics/summary` (protected)
```json
{
  "totalStudents": 3000,
  "riskDistribution": { "low": 1182, "medium": 1350, "high": 468 },
  "averages": { "attendance": 70.6, "marks": 60.2, "feePaid": 75.2 },
  "byClass": { "CIVIL": 620, "EEE": 613, "MECH": 565, "ECE": 584, "CSE": 618 }
}
```

---

## Predictions

The prediction/insights endpoints accept a flexible `PredictInput`. Provide
**one** of:
- raw features: `attendance_percent`, `avg_marks`, `failed_attempts`, `fee_paid_percent`
- a `student_id` (int) that resolves against the loaded roster
- the frontend `StudentData` shape: `gpa`, `attendance`, `feeStatus`, `subjects`

Missing fields default to healthy values. See [risk-scoring.md](risk-scoring.md)
for the normalization rules.

### `POST /api/predict-dropout` (protected)
Request (by id):
```json
{ "student_id": 1 }
```
Request (frontend shape):
```json
{
  "id": "STU003", "gpa": 2.1, "attendance": 45, "feeStatus": "Overdue",
  "subjects": { "ML": { "grade": "F" }, "DB": { "grade": "D" } }
}
```
Response `200` (`RiskPrediction`):
```json
{
  "studentId": "1",
  "riskLevel": "High",
  "riskScore": 60,
  "confidence": 0.95,
  "factors": ["Low attendance (74%)", "Low average marks (40)", "3 failed attempts", "Pending fees (only 59% paid)"],
  "recommendations": ["Schedule an immediate counseling session", "..."],
  "lastUpdated": "2026-07-30T08:28:00+00:00"
}
```

### `POST /api/predict-dropout/batch` (protected)
Request:
```json
{ "students": [ { "student_id": 1 }, { "student_id": 2 } ] }
```
Response `200`: an array of `RiskPrediction` objects.

---

## AI Insights

### `POST /api/student-insights` (protected)
Accepts the same `PredictInput` as prediction. Uses Gemini when configured,
otherwise deterministic fallback. See [gemini.md](gemini.md).

Response `200` (`AIInsights`):
```json
{
  "academicTrends": { "gpaProjection": 1.6, "attendanceProjection": 74.0, "subjectConcerns": ["Core coursework", "Previously failed subjects"] },
  "behavioralIndicators": ["Irregular attendance pattern", "Declining academic performance"],
  "interventionSuggestions": ["Schedule one-on-one academic counseling", "..."],
  "parentEngagementLevel": "Low",
  "source": "fallback"
}
```
`source` is `"gemini"` or `"fallback"`.

---

## Email Alerts

See [email.md](email.md) for templates and SMTP setup.

### `POST /api/email/send-alert` (protected)
Request:
```json
{
  "type": "high_risk",
  "alertData": {
    "studentId": "1", "studentName": "Student_1",
    "riskLevel": "High", "riskScore": 60,
    "riskFactors": ["Low attendance"], "recommendations": ["Counsel"],
    "parentEmail": "parent1@mail.com"
  }
}
```
`type` is one of `high_risk` · `attendance_warning` · `fee_reminder` ·
`counseling_notification`. Each type reads the relevant fields from
`alertData` (e.g. `attendancePercentage`, `pendingAmount` + `dueDate`,
`sessionDate` + `sessionType`); all require `parentEmail`.

Response `200`:
```json
{ "success": true, "message": "(dry-run) alert queued for parent1@mail.com", "dry_run": true }
```

### `POST /api/email/bulk-alerts` (protected)
Request:
```json
{ "alerts": [ { "studentId": "1", "studentName": "Student_1", "riskLevel": "High", "riskScore": 60, "parentEmail": "parent1@mail.com" } ] }
```
Response `200`:
```json
{ "success": true, "sent": 1, "failed": 0, "dry_run": true }
```

---

## Quick reference

| Method | Path | Auth |
|--------|------|------|
| GET  | `/api/health` | – |
| POST | `/api/auth/login` | – |
| GET  | `/api/auth/me` | ✅ |
| GET  | `/api/students` | ✅ |
| GET  | `/api/students/{id}` | ✅ |
| GET  | `/api/analytics/summary` | ✅ |
| POST | `/api/predict-dropout` | ✅ |
| POST | `/api/predict-dropout/batch` | ✅ |
| POST | `/api/student-insights` | ✅ |
| POST | `/api/email/send-alert` | ✅ |
| POST | `/api/email/bulk-alerts` | ✅ |
