"""Pydantic request/response models.

Response models that are consumed by the Next.js frontend intentionally use
camelCase field names so the JSON contract matches the existing TypeScript
interfaces in `frontend/lib/ai-service.ts` and `frontend/lib/email-service.tsx`.
"""

from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, Field

RiskLevel = Literal["Low", "Medium", "High"]

# --------------------------------------------------------------------------- #
# Auth
# --------------------------------------------------------------------------- #


class LoginRequest(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: Literal["student", "teacher", "admin", "counselor"]
    studentId: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# --------------------------------------------------------------------------- #
# Students / features
# --------------------------------------------------------------------------- #


class StudentFeatures(BaseModel):
    attendance_percent: float
    avg_marks: float
    failed_attempts: int
    fee_paid_percent: float


class Student(BaseModel):
    id: int
    name: str
    student_class: str = Field(serialization_alias="class")
    parent_name: str
    parent_email: str
    attendance_percent: float
    avg_marks: float
    failed_attempts: int
    fee_paid_percent: float
    riskLevel: RiskLevel
    riskScore: int


class StudentListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    items: list[Student]


# --------------------------------------------------------------------------- #
# Prediction
# --------------------------------------------------------------------------- #


class PredictInput(BaseModel):
    """Permissive input: accept raw CSV-style features, a stored student id, or
    the richer frontend `StudentData` shape (gpa / attendance / feeStatus /
    subjects). A normalizer derives the four canonical model features."""

    student_id: Optional[int] = None
    id: Optional[str] = None
    name: Optional[str] = None

    # canonical model features
    attendance_percent: Optional[float] = None
    avg_marks: Optional[float] = None
    failed_attempts: Optional[int] = None
    fee_paid_percent: Optional[float] = None

    # frontend StudentData compatibility fields
    gpa: Optional[float] = None
    attendance: Optional[float] = None
    feeStatus: Optional[str] = None
    subjects: Optional[dict[str, Any]] = None


class BatchPredictInput(BaseModel):
    students: list[PredictInput]


class RiskPrediction(BaseModel):
    studentId: str
    riskLevel: RiskLevel
    riskScore: int
    confidence: float
    factors: list[str]
    recommendations: list[str]
    lastUpdated: str


# --------------------------------------------------------------------------- #
# Insights (Gemini-powered, with deterministic fallback)
# --------------------------------------------------------------------------- #


class AcademicTrends(BaseModel):
    gpaProjection: float
    attendanceProjection: float
    subjectConcerns: list[str]


class AIInsights(BaseModel):
    academicTrends: AcademicTrends
    behavioralIndicators: list[str]
    interventionSuggestions: list[str]
    parentEngagementLevel: RiskLevel
    source: Literal["gemini", "fallback"] = "fallback"


# --------------------------------------------------------------------------- #
# Email
# --------------------------------------------------------------------------- #


class StudentAlertData(BaseModel):
    studentId: str
    studentName: str
    riskLevel: RiskLevel
    riskScore: int
    riskFactors: list[str] = []
    recommendations: list[str] = []
    parentEmail: str
    parentName: Optional[str] = None


class SendAlertRequest(BaseModel):
    type: Literal[
        "high_risk",
        "attendance_warning",
        "fee_reminder",
        "counseling_notification",
    ]
    alertData: dict[str, Any]


class BulkAlertRequest(BaseModel):
    alerts: list[StudentAlertData]


class EmailResult(BaseModel):
    success: bool
    message: str
    dry_run: bool = False


class BulkEmailResult(BaseModel):
    success: bool
    sent: int
    failed: int
    dry_run: bool = False
