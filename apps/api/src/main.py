import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np

from src.core.config import settings
from src.core.session_manager import session_manager
from src.services.embedding_service import embedding_service
from src.services.heuristics_service import annotate_dataframe_with_heuristics
from src.routers import health, session, recommendations

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager that handles startup initialization and graceful shutdown.
    Preloads SentenceTransformer weights and in-memory demo dataset once.
    """
    print(f"[*] Starting {settings.app_name} v{settings.app_version}...")
    
    # 1. Warm up SentenceTransformer model
    embedding_service.load_model()

    # 2. Preload anonymized demo dataset if available
    parquet_file = Path(settings.demo_parquet_path)
    if parquet_file.exists():
        print(f"[*] Preloading demo dataset from {parquet_file}...")
        try:
            demo_df = pd.read_parquet(parquet_file)
            demo_df = annotate_dataframe_with_heuristics(demo_df)
            
            # Precompute vectors in RAM for instant demo search
            print(f"[*] Computing embeddings for {len(demo_df)} demo connection profiles...")
            demo_embeddings = embedding_service.encode_documents(
                demo_df["profile_doc"].tolist()
            )
            
            app.state.demo_df = demo_df
            app.state.demo_embeddings = demo_embeddings
            print(f"[+] Successfully loaded {len(demo_df)} demo profiles into memory.")
        except Exception as e:
            print(f"[!] Warning: Could not initialize demo dataset: {e}")
            app.state.demo_df = pd.DataFrame()
            app.state.demo_embeddings = np.empty((0, 384))
    else:
        print(f"[!] Demo parquet not found at {parquet_file}. Operating in upload-only mode.")
        app.state.demo_df = pd.DataFrame()
        app.state.demo_embeddings = np.empty((0, 384))

    yield

    print("[*] Shutting down application. Purging active in-memory sessions...")
    session_manager.cleanup_expired_sessions()
    print("[+] All ephemeral memory released.")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=settings.app_description,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router)
app.include_router(session.router)
app.include_router(recommendations.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8080, reload=True)
