"""Load and merge the CSV datasets into memory (stdlib csv — no pandas)."""

from __future__ import annotations

import csv
from pathlib import Path

from .config import DATA_DIR
from .services import risk_service

# Source filenames (kept verbatim from the original project).
STUDENTS_CSV = "students (2).csv"
ATTENDANCE_CSV = "attendance (1).csv"
MARKS_CSV = "marks.csv"
FEES_CSV = "fees (1).csv"


def _read_csv(path: Path) -> list[dict[str, str]]:
    with open(path, newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def _to_float(value: str, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _to_int(value: str, default: int = 0) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return default


def load_students(data_dir: Path = DATA_DIR) -> list[dict]:
    """Merge the four CSVs on student_id and attach computed risk fields."""
    students = {row["student_id"]: dict(row) for row in _read_csv(data_dir / STUDENTS_CSV)}

    for row in _read_csv(data_dir / ATTENDANCE_CSV):
        sid = row["student_id"]
        if sid in students:
            students[sid]["attendance_percent"] = _to_float(row["attendance_percent"])

    for row in _read_csv(data_dir / MARKS_CSV):
        sid = row["student_id"]
        if sid in students:
            students[sid]["avg_marks"] = _to_float(row["avg_marks"])
            students[sid]["failed_attempts"] = _to_int(row["failed_attempts"])

    for row in _read_csv(data_dir / FEES_CSV):
        sid = row["student_id"]
        if sid in students:
            students[sid]["fee_paid_percent"] = _to_float(row["fee_paid_percent"])

    merged: list[dict] = []
    for sid, row in students.items():
        attendance = _to_float(row.get("attendance_percent"), 100.0)
        marks = _to_float(row.get("avg_marks"), 100.0)
        failed = _to_int(row.get("failed_attempts"), 0)
        fee = _to_float(row.get("fee_paid_percent"), 100.0)

        level, score, _factors = risk_service.score_student(attendance, marks, failed, fee)

        merged.append(
            {
                "id": _to_int(sid),
                "name": row.get("name", f"Student_{sid}"),
                "student_class": row.get("class", ""),
                "parent_name": row.get("parent_name", ""),
                "parent_email": row.get("parent_email", ""),
                "attendance_percent": attendance,
                "avg_marks": marks,
                "failed_attempts": failed,
                "fee_paid_percent": fee,
                "riskLevel": level,
                "riskScore": score,
            }
        )

    merged.sort(key=lambda s: s["id"])
    return merged
