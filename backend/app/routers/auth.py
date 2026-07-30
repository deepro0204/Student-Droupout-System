"""Authentication: JWT login + current-user lookup."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from ..schemas import LoginRequest, TokenResponse, UserOut
from ..security import create_access_token, get_current_user, verify_password
from ..store import store

router = APIRouter(prefix="/auth", tags=["auth"])


def _to_user_out(user: dict) -> UserOut:
    return UserOut(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        studentId=user.get("studentId"),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    user = store.get_user_by_email(payload.email)
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token(user["email"], extra={"role": user["role"]})
    return TokenResponse(access_token=token, user=_to_user_out(user))


@router.get("/me", response_model=UserOut)
def me(current_user: dict = Depends(get_current_user)) -> UserOut:
    return _to_user_out(current_user)
