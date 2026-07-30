"""Email alerts via SMTP (stdlib smtplib).

When SMTP is not configured the service runs in *dry-run* mode: it logs the
message and reports success with ``dry_run=True`` so the rest of the flow works
end-to-end during development.
"""

from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from ..config import settings

logger = logging.getLogger(__name__)


# --------------------------------------------------------------------------- #
# Templates
# --------------------------------------------------------------------------- #

_BASE_STYLE = (
    "body{font-family:Arial,sans-serif;line-height:1.6;color:#333}"
    ".container{max-width:600px;margin:0 auto;padding:20px}"
    ".header{color:#fff;padding:20px;text-align:center}"
    ".content{padding:20px;background:#f9f9f9}"
    ".box{padding:15px;margin:15px 0;border-radius:5px}"
)


def high_risk_template(d: dict) -> tuple[str, str]:
    subject = f"URGENT: Academic Support Needed for {d['studentName']}"
    factors = "".join(f"<li>{f}</li>" for f in d.get("riskFactors", []))
    recs = "".join(f"<li>{r}</li>" for r in d.get("recommendations", []))
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>{_BASE_STYLE}.header{{background:#dc2626}}</style></head><body>
<div class="container">
  <div class="header"><h1>Student Academic Alert</h1>
    <p>Immediate attention required for {d['studentName']}</p></div>
  <div class="content">
    <p>Dear Parent/Guardian,</p>
    <p>Our AI monitoring system has identified that <strong>{d['studentName']}</strong>
       (ID: {d['studentId']}) is currently at <strong>{d['riskLevel']} risk</strong>.</p>
    <div class="box" style="background:#fee2e2">
      <h3>Risk Assessment</h3>
      <p><strong>Risk Level:</strong> {d['riskLevel']}</p>
      <p><strong>Risk Score:</strong> {d['riskScore']}/100</p>
    </div>
    <div class="box" style="background:#fff"><h3>Contributing Factors</h3><ul>{factors}</ul></div>
    <div class="box" style="background:#eff6ff"><h3>Recommended Actions</h3><ul>{recs}</ul></div>
    <p>Please contact our counseling team at your earliest convenience.</p>
    <p>Best regards,<br>CareSphere Student Support Team</p>
  </div></div></body></html>"""
    return subject, html


def attendance_template(d: dict) -> tuple[str, str]:
    subject = f"Attendance Concern: {d['studentName']}"
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>{_BASE_STYLE}.header{{background:#f59e0b}}</style></head><body>
<div class="container">
  <div class="header"><h1>Attendance Warning</h1></div>
  <div class="content"><p>Dear Parent/Guardian,</p>
    <div class="box" style="background:#fef3c7">
      <h3>Current Attendance: {d.get('attendancePercentage', 'N/A')}%</h3>
      <p>This is below the minimum requirement of 75%.</p></div>
    <p>Best regards,<br>Academic Affairs Office</p></div></div></body></html>"""
    return subject, html


def fee_template(d: dict) -> tuple[str, str]:
    subject = f"Fee Payment Reminder: {d['studentName']}"
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>{_BASE_STYLE}.header{{background:#3b82f6}}</style></head><body>
<div class="container">
  <div class="header"><h1>Fee Payment Reminder</h1></div>
  <div class="content"><p>Dear Parent/Guardian,</p>
    <div class="box" style="background:#dbeafe">
      <p><strong>Pending Amount:</strong> ₹{d.get('pendingAmount', 'N/A')}</p>
      <p><strong>Due Date:</strong> {d.get('dueDate', 'N/A')}</p></div>
    <p>Best regards,<br>Finance Office</p></div></div></body></html>"""
    return subject, html


def counseling_template(d: dict) -> tuple[str, str]:
    subject = f"Counseling Session Scheduled: {d['studentName']}"
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>{_BASE_STYLE}.header{{background:#10b981}}</style></head><body>
<div class="container">
  <div class="header"><h1>Counseling Session Scheduled</h1></div>
  <div class="content"><p>Dear Parent/Guardian,</p>
    <div class="box" style="background:#d1fae5">
      <p><strong>Session Type:</strong> {d.get('sessionType', 'N/A')}</p>
      <p><strong>Date &amp; Time:</strong> {d.get('sessionDate', 'N/A')}</p></div>
    <p>Best regards,<br>Counseling Services</p></div></div></body></html>"""
    return subject, html


_TEMPLATES = {
    "high_risk": high_risk_template,
    "attendance_warning": attendance_template,
    "fee_reminder": fee_template,
    "counseling_notification": counseling_template,
}


# --------------------------------------------------------------------------- #
# Sending
# --------------------------------------------------------------------------- #


def _send_smtp(to_email: str, subject: str, html: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{settings.from_name} <{settings.from_email}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
        if settings.smtp_use_tls:
            server.starttls()
        if settings.smtp_user:
            server.login(settings.smtp_user, settings.smtp_password)
        server.sendmail(settings.from_email, [to_email], msg.as_string())


def send_alert(alert_type: str, alert_data: dict) -> dict:
    """Render + send a single alert. Returns {success, message, dry_run}."""
    template_fn = _TEMPLATES.get(alert_type)
    if template_fn is None:
        return {"success": False, "message": f"Unknown alert type: {alert_type}", "dry_run": False}

    to_email = alert_data.get("parentEmail")
    if not to_email:
        return {"success": False, "message": "Missing parentEmail", "dry_run": False}

    subject, html = template_fn(alert_data)

    if not settings.smtp_enabled:
        logger.info("[DRY-RUN EMAIL] to=%s subject=%s", to_email, subject)
        return {"success": True, "message": f"(dry-run) alert queued for {to_email}", "dry_run": True}

    try:
        _send_smtp(to_email, subject, html)
        return {"success": True, "message": f"Alert sent to {to_email}", "dry_run": False}
    except Exception as exc:  # noqa: BLE001
        logger.error("SMTP send failed: %s", exc)
        return {"success": False, "message": f"Failed to send: {exc}", "dry_run": False}
