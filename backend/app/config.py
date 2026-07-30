"""Application configuration, loaded from environment / .env file."""

from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/ directory (two levels up from this file: app/config.py -> app -> backend)
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- General ---
    app_name: str = "CareSphere API"
    environment: str = "development"

    # --- CORS: comma-separated list of allowed frontend origins ---
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # --- Auth / JWT ---
    secret_key: str = "dev-secret-change-me-in-production"
    access_token_expire_minutes: int = 60 * 12  # 12 hours
    demo_password: str = "password"  # seeded password for all demo accounts

    # --- Gemini ---
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"
    gemini_timeout_seconds: float = 20.0

    # --- Email / SMTP (optional; falls back to dry-run when unset) ---
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = True
    from_email: str = "noreply@caresphere.edu"
    from_name: str = "CareSphere Student Support"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def gemini_enabled(self) -> bool:
        return bool(self.gemini_api_key.strip())

    @property
    def smtp_enabled(self) -> bool:
        return bool(self.smtp_host.strip())


settings = Settings()
