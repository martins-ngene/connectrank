import os
from pathlib import Path
from typing import List
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ROOT_DIR = BASE_DIR.parent.parent
DEFAULT_DEMO_PARQUET = BASE_DIR / "data" / "demo_connections.parquet"

# Automatically load environment variables from root or apps/api .env files
try:
    from dotenv import load_dotenv
    for env_path in [
        ROOT_DIR / ".env",
        ROOT_DIR / ".env.production",
        BASE_DIR / ".env",
        BASE_DIR / ".env.production",
    ]:
        if env_path.is_file():
            load_dotenv(dotenv_path=env_path, override=False)
except ImportError:
    pass

class Settings(BaseModel):
    app_name: str = "ConnectRank"
    app_version: str = "1.0.0"
    app_description: str = (
        "High-performance semantic match and heuristic decision engine for ConnectRank network recommendations. "
        "Engineered with strict zero-persistence in-memory storage for GDPR compliance."
    )
    model_name: str = os.getenv("MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
    demo_parquet_path: str = os.getenv("DEMO_PARQUET_PATH", str(DEFAULT_DEMO_PARQUET))
    session_ttl_minutes: int = int(os.getenv("SESSION_TTL_MINUTES", "30"))
    max_upload_size_mb: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "15"))
    default_semantic_weight: float = 0.6
    default_authority_weight: float = 0.4
    
    # Monitoring (Sentry)
    sentry_dsn: str | None = os.getenv("SENTRY_DSN", None)
    environment: str = os.getenv("ENVIRONMENT", "development")
    sentry_traces_sample_rate: float = float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1"))
    sentry_profiles_sample_rate: float = float(os.getenv("SENTRY_PROFILES_SAMPLE_RATE", "0.0"))

    # CORS Configuration
    cors_origins: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173,https://connectrank.flowkeit.com,https://connectrank.pages.dev,https://api.connectrank.flowkeit.com,*"
        ).split(",")
        if origin.strip()
    ]

settings = Settings()
