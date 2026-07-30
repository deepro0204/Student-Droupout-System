"""AI-powered student insights (Gemini, with deterministic fallback)."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from ..features import normalize
from ..schemas import AIInsights, PredictInput
from ..security import get_current_user
from ..services import gemini_service

router = APIRouter(tags=["insights"])


@router.post("/student-insights", response_model=AIInsights)
async def student_insights(
    payload: PredictInput,
    _user: dict = Depends(get_current_user),
) -> AIInsights:
    student_id, features = normalize(payload)
    result = await gemini_service.generate_insights(student_id, features)
    return AIInsights(**result)
