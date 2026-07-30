# Email Alerts

Parent/guardian notifications are sent over SMTP by
[`app/services/email_service.py`](../backend/app/services/email_service.py), and
exposed via the `/api/email/*` routes. Without SMTP configured, the service
runs in **dry-run** mode (messages are logged, reported as sent with
`dry_run: true`) so the full flow works during development.

## Alert types

| `type` | Template header | Reads from `alertData` |
|--------|-----------------|------------------------|
| `high_risk` | red | `studentName`, `studentId`, `riskLevel`, `riskScore`, `riskFactors[]`, `recommendations[]`, `parentEmail` |
| `attendance_warning` | amber | `studentName`, `attendancePercentage`, `parentEmail` |
| `fee_reminder` | blue | `studentName`, `pendingAmount`, `dueDate`, `parentEmail` |
| `counseling_notification` | green | `studentName`, `sessionType`, `sessionDate`, `parentEmail` |

All types require `parentEmail`. Templates are inline, styled HTML built in the
service (`high_risk_template`, `attendance_template`, `fee_template`,
`counseling_template`).

## Endpoints

- `POST /api/email/send-alert` — one alert; returns
  `{ success, message, dry_run }`.
- `POST /api/email/bulk-alerts` — sends a `high_risk` alert per item; returns
  `{ success, sent, failed, dry_run }`.

See [api-reference.md](api-reference.md#email-alerts) for request bodies.

SMTP is blocking, so sends run off the event loop via `asyncio.to_thread` to
keep the API responsive.

## Enabling real delivery

Set SMTP variables in `backend/.env` (see [configuration.md](configuration.md)):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASSWORD=your_app_password
SMTP_USE_TLS=true
FROM_EMAIL=noreply@yourschool.edu
FROM_NAME=CareSphere Student Support
```

`GET /api/health` should then report `"smtp_enabled": true`, and responses will
have `"dry_run": false`.

### Common providers
- **Gmail:** host `smtp.gmail.com`, port `587`, and an **App Password**
  (requires 2-Step Verification) — not your normal password.
- **SendGrid / Mailgun / Amazon SES:** use the provider's SMTP host, port `587`,
  and the issued SMTP credentials.

## Delivery semantics

- On SMTP error the service returns `{ "success": false, "message": "Failed to send: ..." }`
  (HTTP `200` — the failure is in the payload, not the status).
- There is no retry queue or persistence; failed sends are reported per-request.
  For production, put sending behind a durable queue (e.g. a task worker) and
  log delivery outcomes.
