"""Dropout risk prediction (single + batch)."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from ..features import normalize
from ..schemas import BatchPredictInput, PredictInput, RiskPrediction
from ..security import get_current_user
from ..services import risk_service

router = APIRouter(tags=["predictions"])


def _predict(inp: PredictInput) -> RiskPrediction:
    student_id, features = normalize(inp)
    result = risk_service.build_prediction(
        student_id=student_id,
        attendance=features["attendance_percent"],
        marks=features["avg_marks"],
        failed=features["failed_attempts"],
        fee=features["fee_paid_percent"],
    )
    return RiskPrediction(**result)


@router.post("/predict-dropout", response_model=RiskPrediction)
def predict_dropout(
    payload: PredictInput,
    _user: dict = Depends(get_current_user),
) -> RiskPrediction:
    return _predict(payload)


@router.post("/predict-dropout/batch", response_model=list[RiskPrediction])
def predict_dropout_batch(
    payload: BatchPredictInput,
    _user: dict = Depends(get_current_user),
) -> list[RiskPrediction]:
    return [_predict(s) for s in payload.students]
