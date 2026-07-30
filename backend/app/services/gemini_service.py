"""AI insights via the Google Gemini REST API, with a deterministic fallback.

If ``GEMINI_API_KEY`` is not configured (or the call fails), we return a
rule-derived set of insights so the endpoint always responds successfully.
"""

from __future__ import annotations

import json
import logging

import httpx

from ..config import settings

logger = logging.getLogger(__name__)

_ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "{model}:generateContent"
)

_SYSTEM_INSTRUCTION = (
    "You are an academic early-warning assistant for a student dropout "
    "prevention platform. Given one student's academic indicators, produce "
    "concise, actionable insights for counselors. Respond ONLY with JSON."
)

_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "academicTrends": {
            "type": "object",
            "properties": {
                "gpaProjection": {"type": "number"},
                "attendanceProjection": {"type": "number"},
                "subjectConcerns": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["gpaProjection", "attendanceProjection", "subjectConcerns"],
        },
        "behavioralIndicators": {"type": "array", "items": {"type": "string"}},
        "interventionSuggestions": {"type": "array", "items": {"type": "string"}},
        "parentEngagementLevel": {"type": "string", "enum": ["Low", "Medium", "High"]},
    },
    "required": [
        "academicTrends",
        "behavioralIndicators",
        "interventionSuggestions",
        "parentEngagementLevel",
    ],
}


def _gpa_from_marks(marks: float) -> float:
    return round(max(0.0, min(4.0, marks / 25.0)), 2)


def _fallback_insights(features: dict) -> dict:
    attendance = features["attendance_percent"]
    marks = features["avg_marks"]
    failed = features["failed_attempts"]
    fee = features["fee_paid_percent"]

    behavioral: list[str] = []
    if attendance < 80:
        behavioral.append("Irregular attendance pattern")
    if marks < 55:
        behavioral.append("Declining academic performance")
    if failed > 1:
        behavioral.append("Repeated exam failures indicate disengagement")
    if fee < 70:
        behavioral.append("Financial stress may affect focus")

    concerns: list[str] = []
    if marks < 50:
        concerns.append("Core coursework")
    if failed > 1:
        concerns.append("Previously failed subjects")

    engagement = "High" if attendance > 85 else "Medium" if attendance > 70 else "Low"

    return {
        "academicTrends": {
            "gpaProjection": _gpa_from_marks(marks),
            "attendanceProjection": round(attendance, 1),
            "subjectConcerns": concerns,
        },
        "behavioralIndicators": behavioral,
        "interventionSuggestions": [
            "Schedule one-on-one academic counseling",
            "Provide additional tutoring support",
            "Engage parents in academic planning",
            "Monitor attendance more closely",
        ],
        "parentEngagementLevel": engagement,
        "source": "fallback",
    }


async def generate_insights(student_id: str, features: dict) -> dict:
    """Return AIInsights-shaped dict. Uses Gemini when configured."""
    if not settings.gemini_enabled:
        return _fallback_insights(features)

    prompt = (
        f"{_SYSTEM_INSTRUCTION}\n\n"
        f"Student {student_id} indicators:\n"
        f"- Attendance: {features['attendance_percent']:.0f}%\n"
        f"- Average marks: {features['avg_marks']:.0f} / 100\n"
        f"- Failed attempts: {features['failed_attempts']}\n"
        f"- Fees paid: {features['fee_paid_percent']:.0f}%\n\n"
        "Provide: academicTrends (gpaProjection on a 0-4 scale, "
        "attendanceProjection as a percentage, subjectConcerns list), "
        "behavioralIndicators, interventionSuggestions, and "
        "parentEngagementLevel (Low/Medium/High)."
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": _RESPONSE_SCHEMA,
            "temperature": 0.4,
        },
    }
    url = _ENDPOINT.format(model=settings.gemini_model)

    try:
        async with httpx.AsyncClient(timeout=settings.gemini_timeout_seconds) as client:
            resp = await client.post(
                url,
                params={"key": settings.gemini_api_key},
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(text)
            parsed["source"] = "gemini"
            # Defensive: ensure all required keys exist, else merge with fallback.
            fb = _fallback_insights(features)
            for key, val in fb.items():
                parsed.setdefault(key, val)
            parsed["source"] = "gemini"
            return parsed
    except Exception as exc:  # noqa: BLE001 — any failure degrades to fallback
        logger.warning("Gemini insights failed (%s); using fallback", exc)
        return _fallback_insights(features)
