import os
from pathlib import Path
from typing import List
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_DEMO_PARQUET = BASE_DIR / "data" / "demo_connections.parquet"

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
    
    # CORS Configuration
    cors_origins: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173,*"
        ).split(",")
        if origin.strip()
    ]

settings = Settings()
