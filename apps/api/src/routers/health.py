from fastapi import APIRouter, Request
from src.core.config import settings
from src.core.session_manager import session_manager
from src.models.schemas import HealthResponse

router = APIRouter(tags=["Health & System"])

@router.get("/health", response_model=HealthResponse, summary="System Health & Privacy Status")
def health(request: Request):
    """
    Returns system status, model information, number of preloaded demo profiles,
    and active in-memory ephemeral sessions count.
    """
    demo_df = getattr(request.app.state, "demo_df", None)
    demo_count = len(demo_df) if demo_df is not None else 0
    
    return HealthResponse(
        status="healthy",
        version=settings.app_version,
        demo_profiles_indexed=demo_count,
        active_ephemeral_sessions=session_manager.active_session_count(),
        privacy_guarantee="Zero-persistence. User PII is processed strictly in RAM and automatically purged."
    )
