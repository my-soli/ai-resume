from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "Resume AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    DATABASE_URL: str = "postgresql://resumeai:resumeai_password@localhost:5432/resumeai_db"

    @property
    def async_database_url(self) -> str:
        # Railway injects postgresql:// but asyncpg needs postgresql+asyncpg://
        url = self.DATABASE_URL
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        return url

    JWT_SECRET_KEY: str = "change-this-secret-key-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    STORAGE_TYPE: str = "local"
    S3_BUCKET: Optional[str] = None
    S3_REGION: Optional[str] = "us-east-1"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    LOCAL_STORAGE_PATH: str = "./storage"

    AI_RATE_LIMIT: str = "10/minute"

    # Google Play billing
    GOOGLE_PLAY_PACKAGE_NAME: str = "com.resumeai.resume_ai"
    GOOGLE_PLAY_SERVICE_ACCOUNT_JSON: Optional[str] = None

    # Paddle billing
    PADDLE_WEBHOOK_SECRET: Optional[str] = None

    # Email / SMTP (optional — if not set, reset codes are printed to logs)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_TLS: bool = True
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM: str = "noreply@resumeai.app"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
