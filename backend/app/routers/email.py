"""Email alert endpoints (single + bulk)."""

from __future__ import annotations

import asyncio

from fastapi import APIRouter, Depends

from ..schemas import (
    BulkAlertRequest,
    BulkEmailResult,
    EmailResult,
    SendAlertRequest,
)
from ..security import get_current_user
from ..services import email_service

router = APIRouter(prefix="/email", tags=["email"])


@router.post("/send-alert", response_model=EmailResult)
async def send_alert(
    payload: SendAlertRequest,
    _user: dict = Depends(get_current_user),
) -> EmailResult:
    # smtplib is blocking — run it off the event loop.
    result = await asyncio.to_thread(
        email_service.send_alert, payload.type, payload.alertData
    )
    return EmailResult(**result)


@router.post("/bulk-alerts", response_model=BulkEmailResult)
async def bulk_alerts(
    payload: BulkAlertRequest,
    _user: dict = Depends(get_current_user),
) -> BulkEmailResult:
    sent = failed = 0
    dry_run = False
    for alert in payload.alerts:
        result = await asyncio.to_thread(
            email_service.send_alert, "high_risk", alert.model_dump()
        )
        dry_run = dry_run or result.get("dry_run", False)
        if result.get("success"):
            sent += 1
        else:
            failed += 1
    return BulkEmailResult(success=failed == 0, sent=sent, failed=failed, dry_run=dry_run)
