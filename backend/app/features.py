"""Normalize the various accepted prediction inputs into the four canonical
model features: attendance_percent, avg_marks, failed_attempts, fee_paid_percent.

Accepts, in priority order:
  1. explicit CSV-style features on the request
  2. a stored student's features (when ``student_id`` matches a loaded record)
  3. the frontend ``StudentData`` shape (gpa / attendance / feeStatus / subjects)
Anything still missing defaults to a "healthy" value so absent data never
inflates the risk score.
"""

from __future__ import annotations

from .schemas import PredictInput

_FAIL_GRADES = {"D", "D+", "D-", "F"}
_FEE_STATUS_MAP = {"paid": 100.0, "partially paid": 50.0, "overdue": 0.0}


def _first(*values, default):
    for v in values:
        if v is not None:
            return v
    return default


def _failed_from_subjects(subjects: dict | None) -> int | None:
    if not subjects:
        return None
    count = 0
    for data in subjects.values():
        grade = (data or {}).get("grade") if isinstance(data, dict) else None
        if grade and grade.strip().upper() in _FAIL_GRADES:
            count += 1
    return count


def _fee_from_status(status: str | None) -> float | None:
    if not status:
        return None
    return _FEE_STATUS_MAP.get(status.lower().strip(), 50.0)


def normalize(inp: PredictInput) -> tuple[str, dict]:
    from .store import store

    stored = store.get_student(inp.student_id) if inp.student_id is not None else None

    marks_from_gpa = inp.gpa * 25.0 if inp.gpa is not None else None
    fee_from_status = _fee_from_status(inp.feeStatus)
    failed_from_subjects = _failed_from_subjects(inp.subjects)

    if stored:
        default_att = stored["attendance_percent"]
        default_marks = stored["avg_marks"]
        default_failed = stored["failed_attempts"]
        default_fee = stored["fee_paid_percent"]
        student_id = str(inp.student_id)
    else:
        default_att = 100.0
        default_marks = 100.0
        default_failed = 0
        default_fee = 100.0
        student_id = inp.id or (str(inp.student_id) if inp.student_id is not None else "unknown")

    features = {
        "attendance_percent": float(
            _first(inp.attendance_percent, inp.attendance, default=default_att)
        ),
        "avg_marks": float(
            _first(inp.avg_marks, marks_from_gpa, default=default_marks)
        ),
        "failed_attempts": int(
            _first(inp.failed_attempts, failed_from_subjects, default=default_failed)
        ),
        "fee_paid_percent": float(
            _first(inp.fee_paid_percent, fee_from_status, default=default_fee)
        ),
    }
    return student_id, features
