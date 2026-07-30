"""Deterministic, explainable risk scoring.

The categorical risk level reproduces the exact rule the RandomForest in
`risk_flagging.py` was trained on (which is why that model reports ~100%
accuracy — it memorized this rule). We additionally derive a 0-100 risk score
and human-readable factors / recommendations for the UI.
"""

from __future__ import annotations

from datetime import datetime, timezone

from ..schemas import RiskLevel

# Thresholds — must stay in sync with backend/risk_flagging.py
ATTENDANCE_MIN = 75
MARKS_MIN = 50
FAILED_MAX = 1
FEE_MIN = 70


def _rule_level(attendance: float, marks: float, failed: int, fee: float) -> RiskLevel:
    """The original categorical rule from risk_flagging.py."""
    score = 0
    if attendance < ATTENDANCE_MIN:
        score += 1
    if marks < MARKS_MIN or failed > FAILED_MAX:
        score += 1
    if fee < FEE_MIN:
        score += 1
    if score <= 1:
        return "Low"
    if score == 2:
        return "Medium"
    return "High"


def score_student(
    attendance: float,
    marks: float,
    failed: int,
    fee: float,
) -> tuple[RiskLevel, int, list[str]]:
    """Return (riskLevel, riskScore 0-100, contributing factors)."""
    points = 0.0
    factors: list[str] = []

    # Attendance — up to 35 pts
    if attendance < ATTENDANCE_MIN:
        pts = min(35.0, 15.0 + (ATTENDANCE_MIN - attendance) * 0.5)
        points += pts
        factors.append(f"Low attendance ({attendance:.0f}%)")

    # Academics — marks up to 30, failed attempts up to 15
    if marks < MARKS_MIN:
        pts = min(30.0, 15.0 + (MARKS_MIN - marks) * 0.4)
        points += pts
        factors.append(f"Low average marks ({marks:.0f})")
    if failed > FAILED_MAX:
        points += min(15.0, failed * 5.0)
        factors.append(f"{failed} failed attempts")

    # Fees — up to 20 pts
    if fee < FEE_MIN:
        pts = min(20.0, 8.0 + (FEE_MIN - fee) * 0.2)
        points += pts
        factors.append(f"Pending fees (only {fee:.0f}% paid)")

    risk_score = int(round(min(100.0, points)))
    level = _rule_level(attendance, marks, failed, fee)
    return level, risk_score, factors


def recommendations_for(level: RiskLevel, factors: list[str]) -> list[str]:
    base: dict[RiskLevel, list[str]] = {
        "High": [
            "Schedule an immediate counseling session",
            "Arrange a parent-teacher conference",
            "Provide intensive academic support / tutoring",
            "Consider a reduced course load",
            "Connect the student with mental-health resources",
        ],
        "Medium": [
            "Schedule regular check-ins",
            "Provide targeted tutoring support",
            "Monitor attendance closely",
            "Engage with the academic advisor",
        ],
        "Low": [
            "Continue regular monitoring",
            "Encourage participation in study groups",
            "Maintain good parent communication",
        ],
    }
    recs = list(base[level])

    joined = " ".join(factors).lower()
    if "attendance" in joined:
        recs.append("Set up an attendance-monitoring plan with morning check-ins")
    if "marks" in joined or "failed" in joined:
        recs.append("Create a personalized study plan for weak subjects")
    if "fee" in joined:
        recs.append("Discuss financial-aid options or a payment plan")
    return recs


def confidence_for(level: RiskLevel) -> float:
    # Deterministic rule => high, stable confidence.
    return {"High": 0.95, "Medium": 0.9, "Low": 0.92}[level]


def build_prediction(
    student_id: str,
    attendance: float,
    marks: float,
    failed: int,
    fee: float,
) -> dict:
    level, score, factors = score_student(attendance, marks, failed, fee)
    return {
        "studentId": student_id,
        "riskLevel": level,
        "riskScore": score,
        "confidence": confidence_for(level),
        "factors": factors,
        "recommendations": recommendations_for(level, factors),
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
    }
