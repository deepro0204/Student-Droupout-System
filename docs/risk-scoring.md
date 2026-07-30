# Risk Scoring

The risk engine lives in
[`app/services/risk_service.py`](../backend/app/services/risk_service.py). It is
**deterministic and explainable** — every flag maps to a concrete factor a
counselor can act on.

## The four features

All scoring is based on four per-student features, merged from the CSVs:

| Feature | Source CSV | Meaning |
|---------|-----------|---------|
| `attendance_percent` | `attendance (1).csv` | Overall attendance %. |
| `avg_marks` | `marks.csv` | Average marks out of 100. |
| `failed_attempts` | `marks.csv` | Count of failed exam attempts. |
| `fee_paid_percent` | `fees (1).csv` | Fees paid %. |

## Risk level (categorical)

The level reproduces the exact rule from
[`risk_flagging.py`](../backend/risk_flagging.py). Three binary conditions each
add one point:

```
score  = (attendance_percent < 75)
       + (avg_marks < 50  OR  failed_attempts > 1)
       + (fee_paid_percent < 70)

level  = Low     if score <= 1
         Medium  if score == 2
         High     if score == 3
```

Thresholds are module constants (`ATTENDANCE_MIN=75`, `MARKS_MIN=50`,
`FAILED_MAX=1`, `FEE_MIN=70`) — change them in one place to retune.

## Risk score (0–100)

For display and ranking, a weighted numeric score is derived from the same
signals. Each dimension contributes only when it breaches its threshold:

| Dimension | Max points | Formula (clamped to max) |
|-----------|-----------:|--------------------------|
| Attendance | 35 | `15 + (75 − attendance) × 0.5` |
| Low marks | 30 | `15 + (50 − marks) × 0.4` |
| Failed attempts | 15 | `failed × 5` |
| Fees | 20 | `8 + (70 − fee) × 0.2` |

`riskScore = round(min(100, sum of the above))`.

`confidence` is fixed by level (High `0.95`, Medium `0.90`, Low `0.92`) —
the rule is deterministic, so confidence is stable rather than probabilistic.

## Factors and recommendations

- **Factors** are the human-readable reasons a student breached thresholds,
  e.g. `"Low attendance (74%)"`, `"3 failed attempts"`.
- **Recommendations** combine a level-based baseline (e.g. High-risk students
  get *"Schedule an immediate counseling session"*) with factor-specific
  additions (attendance → check-ins, marks/failures → study plan, fees →
  financial-aid options).

## Relationship to the RandomForest model

The repo ships a trained model (`backend/models/dropout_model.pkl`) whose
[`training_report.txt`](../backend/models/training_report.txt) reports ~100%
accuracy. That is expected: the model was trained on labels produced by the
rule above, so it simply memorized the rule. Because the rule is the ground
truth, the backend reimplements it directly in Python — identical results, and
no `scikit-learn` runtime dependency.

To experiment with a genuinely learned model, retrain on real dropout outcomes
(not rule-derived labels) and load the `.pkl` in a new service; the API's
`risk_service` is the single integration point to swap.

## Input normalization

`POST /predict-dropout` and `/student-insights` accept several input shapes;
[`app/features.py`](../backend/app/features.py) normalizes them to the four
features, in this priority order:

1. Explicit raw features on the request.
2. The frontend `StudentData` shape:
   - `gpa` (0–4) → `avg_marks` via `gpa × 25`
   - `feeStatus` → `fee_paid_percent` (`Paid`=100, `Partially Paid`=50, `Overdue`=0)
   - `subjects` → `failed_attempts` = count of grades in `{D, D+, D-, F}`
3. A stored student's features when `student_id` matches the roster.
4. Healthy defaults for anything still missing (attendance 100, marks 100,
   failed 0, fee 100) so absent data never inflates risk.
