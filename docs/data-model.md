# Data Model

The backend loads its dataset **into memory** at startup — there is no database.
Loading and merging is done with the Python standard-library `csv` module in
[`app/data_loader.py`](../backend/app/data_loader.py); the result is held by the
singleton in [`app/store.py`](../backend/app/store.py).

## Source CSVs

Located in [`backend/data/`](../backend/data/), all keyed on `student_id`
(~3,000 rows each):

| File | Columns |
|------|---------|
| `students (2).csv` | `student_id, name, class, parent_name, parent_email` |
| `attendance (1).csv` | `student_id, attendance_percent` |
| `marks.csv` | `student_id, avg_marks, failed_attempts` |
| `fees (1).csv` | `student_id, fee_paid_percent` |
| `final_with_risk.csv` | merged output of `risk_flagging.py` (not used at runtime) |

## Merge & enrichment

`load_students()`:
1. Reads `students (2).csv` as the base, keyed by `student_id`.
2. Left-joins attendance, marks and fees onto each student.
3. Computes `riskLevel` + `riskScore` for every student via `risk_service`
   (see [risk-scoring.md](risk-scoring.md)).
4. Returns a list sorted by numeric id.

Missing numeric values default to "healthy" figures (attendance/marks/fee 100,
failed 0) so incomplete rows never register as false positives.

## In-memory student record

Each merged record (and the `Student` API response) has these fields:

```jsonc
{
  "id": 1,                      // int
  "name": "Student_1",
  "class": "CIVIL",             // serialized as "class" (Python attr: student_class)
  "parent_name": "Parent_1",
  "parent_email": "parent1@mail.com",
  "attendance_percent": 74.0,
  "avg_marks": 40.0,
  "failed_attempts": 3,
  "fee_paid_percent": 59.0,
  "riskLevel": "High",          // Low | Medium | High
  "riskScore": 60               // 0–100
}
```

> Note: `student_class` is the Python attribute name; it is serialized to JSON
> as `class` (a reserved word in Python) via a Pydantic serialization alias.

## Store operations

[`DataStore`](../backend/app/store.py) exposes:

| Method | Used by | Description |
|--------|---------|-------------|
| `load()` | startup lifespan | Merge CSVs + seed users (idempotent). |
| `get_student(id)` | `GET /students/{id}`, feature lookup | O(1) by-id lookup. |
| `query_students(skip, limit, risk, search)` | `GET /students` | Filter + paginate. |
| `analytics_summary()` | `GET /analytics/summary` | Risk distribution, averages, per-class counts. |
| `get_user_by_email(email)` | auth | Demo-account lookup. |

## Users

Four demo accounts are seeded in memory at startup (not from CSV) with
pbkdf2-hashed passwords. See [authentication.md](authentication.md).

## Persistence caveat

Because the store is in memory, it is **read-only** for the dataset and resets
on restart. To support writes / real persistence, replace `DataStore` with a
database-backed repository (e.g. SQLAlchemy + SQLite/Postgres) behind the same
method surface — the routers depend only on those methods, not on storage
details.
