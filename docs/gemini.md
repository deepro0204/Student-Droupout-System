# Gemini AI Insights

The `/api/student-insights` endpoint produces qualitative, counselor-facing
insights. It uses Google **Gemini** when configured, and a deterministic
fallback otherwise. Implementation:
[`app/services/gemini_service.py`](../backend/app/services/gemini_service.py).

## What it returns (`AIInsights`)

```jsonc
{
  "academicTrends": {
    "gpaProjection": 1.6,          // projected GPA on a 0–4 scale
    "attendanceProjection": 74.0,  // projected attendance %
    "subjectConcerns": ["Core coursework"]
  },
  "behavioralIndicators": ["Irregular attendance pattern"],
  "interventionSuggestions": ["Schedule one-on-one academic counseling"],
  "parentEngagementLevel": "Low",  // Low | Medium | High
  "source": "gemini"               // or "fallback"
}
```

`source` tells you which engine produced the result.

## Enabling Gemini

1. Create an API key at <https://aistudio.google.com/app/apikey>.
2. Set it in `backend/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-2.0-flash
   ```
3. Restart the backend. `GET /api/health` should show `"gemini_enabled": true`.

## How the call works

- **Transport:** direct REST call to
  `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
  via `httpx.AsyncClient` (no SDK dependency).
- **Structured output:** the request sets `responseMimeType: application/json`
  plus a `responseSchema`, so Gemini returns strict JSON matching `AIInsights`.
- **Prompt:** a compact summary of the student's four indicators plus
  instructions to produce projections, behavioral indicators, intervention
  suggestions and a parent-engagement level.
- **Temperature:** `0.4` (favor consistency over creativity).
- **Timeout:** `GEMINI_TIMEOUT_SECONDS` (default 20 s).

## Fallback behavior

The deterministic fallback is used when:
- `GEMINI_API_KEY` is unset, **or**
- the API call errors, times out, or returns malformed JSON.

The fallback derives sensible insights from the same four features (e.g.
`gpaProjection = marks / 25`, engagement from attendance bands) and always
returns a valid `AIInsights` object with `"source": "fallback"`. As a safety
net, any keys missing from a Gemini response are backfilled from the fallback.

This means the endpoint **never fails** due to AI unavailability — callers get
a consistent contract either way.

## Cost & privacy notes

- Only the four numeric indicators and an opaque student id are sent to Gemini —
  no names, emails, or free-text PII.
- Each insights request is one Gemini call; cache results client-side if you
  render them repeatedly for the same student.
