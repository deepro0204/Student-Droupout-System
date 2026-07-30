"""Student records + roster analytics (from the in-memory CSV store)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from ..schemas import Student, StudentListResponse
from ..security import get_current_user
from ..store import store

router = APIRouter(tags=["students"])


def _to_student(row: dict) -> Student:
    return Student(**row)


@router.get("/students", response_model=StudentListResponse)
def list_students(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    risk: str | None = Query(None, description="Filter by Low/Medium/High"),
    search: str | None = Query(None, description="Match name, id or class"),
    _user: dict = Depends(get_current_user),
) -> StudentListResponse:
    total, items = store.query_students(skip=skip, limit=limit, risk=risk, search=search)
    return StudentListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=[_to_student(r) for r in items],
    )


@router.get("/students/{student_id}", response_model=Student)
def get_student(student_id: int, _user: dict = Depends(get_current_user)) -> Student:
    row = store.get_student(student_id)
    if not row:
        raise HTTPException(status_code=404, detail="Student not found")
    return _to_student(row)


@router.get("/analytics/summary")
def analytics_summary(_user: dict = Depends(get_current_user)) -> dict:
    return store.analytics_summary()
