"""FastAPI application entrypoint.

All routes are mounted under ``/api`` so the base URL matches the frontend's
default of ``http://localhost:8000/api``.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import auth, email, insights, predictions, students
from .store import store

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    logger.info("Loading data into memory...")
    store.load()
    logger.info(
        "Loaded %d students. Gemini=%s, SMTP=%s",
        len(store.students),
        "on" if settings.gemini_enabled else "off (fallback)",
        "on" if settings.smtp_enabled else "off (dry-run)",
    )
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="AI-based student dropout prediction & counseling backend.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(students.router, prefix=API_PREFIX)
app.include_router(predictions.router, prefix=API_PREFIX)
app.include_router(insights.router, prefix=API_PREFIX)
app.include_router(email.router, prefix=API_PREFIX)


@app.get("/", tags=["health"])
def root() -> dict:
    return {
        "service": settings.app_name,
        "status": "ok",
        "docs": "/docs",
        "students_loaded": len(store.students),
    }


@app.get("/api/health", tags=["health"])
def health() -> dict:
    return {
        "status": "ok",
        "students_loaded": len(store.students),
        "gemini_enabled": settings.gemini_enabled,
        "smtp_enabled": settings.smtp_enabled,
    }
