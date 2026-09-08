from typing import List, Optional
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Request, HTTPException, Query, Body, status
import pandas as pd
# pyrefly: ignore [missing-import]
import numpy as np

from src.core.session_manager import session_manager
from src.models.schemas import RecommendationResponse, RecommendationQuery
from src.services.ranking_service import rank_candidates

router = APIRouter(tags=["Recommendations"])

@router.post(
    "/recommend",
    response_model=List[RecommendationResponse],
    summary="Rank Connections for Target Pitch Query"
)
def recommend(
    request: Request,
    pitch: Optional[str] = Query(None, description="Target role pitch query, e.g. 'Senior Backend Engineer Python AWS'"),
    top_k: int = Query(15, ge=1, le=100, description="Number of recommendations to return"),
    semantic_weight: float = Query(0.6, ge=0.0, le=1.0, description="Semantic match weight"),
    authority_weight: float = Query(0.4, ge=0.0, le=1.0, description="Authority heuristic weight"),
    session_id: Optional[str] = Query(None, description="Optional ephemeral session ID from /upload"),
    min_authority: Optional[float] = Query(None, ge=0.0, le=1.0, description="Optional minimum authority threshold"),
    remote_only: bool = Query(False, description="Filter only connections in companies hiring for remote, anywhere, worldwide, or global"),
    body: Optional[RecommendationQuery] = Body(None, description="Optional JSON request body")
):
    r"""
    Computes a composite score:
    
    $$\text{Final Score} = w_s \times \text{CosineSimilarity}(\vec{q}, \vec{c}) + w_a \times \text{Authority}(c)$$
    
    If `session_id` is provided, queries the user's private, in-memory ephemeral connections.
    If no `session_id` is provided, queries the anonymized preloaded demo network.
    """
    # Prefer body if provided, otherwise fallback to query parameters
    effective_pitch = (body.pitch if body and body.pitch else pitch)
    if not effective_pitch or not effective_pitch.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The 'pitch' parameter is required to generate recommendations."
        )

    effective_top_k = body.top_k if body else top_k
    effective_sem_weight = body.semantic_weight if body else semantic_weight
    effective_auth_weight = body.authority_weight if body else authority_weight
    effective_session_id = body.session_id if body and body.session_id else session_id
    effective_min_auth = body.min_authority if body else min_authority
    effective_remote_only = body.remote_only if (body and body.remote_only) else remote_only

    query = RecommendationQuery(
        pitch=effective_pitch.strip(),
        top_k=effective_top_k,
        semantic_weight=effective_sem_weight,
        authority_weight=effective_auth_weight,
        session_id=effective_session_id,
        min_authority=effective_min_auth,
        remote_only=effective_remote_only
    )

    df: Optional[pd.DataFrame] = None
    embeddings: Optional[np.ndarray] = None

    # Determine data source
    if effective_session_id:
        session = session_manager.get_session(effective_session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session '{effective_session_id}' not found or has expired. Please re-upload your CSV or use Demo Mode."
            )
        df = session.df
        embeddings = session.embeddings
    else:
        # Fall back to Demo Mode if available
        demo_df = getattr(request.app.state, "demo_df", None)
        demo_embeddings = getattr(request.app.state, "demo_embeddings", None)
        if isinstance(demo_df, pd.DataFrame):
            df = demo_df
        if isinstance(demo_embeddings, np.ndarray):
            embeddings = demo_embeddings

    if df is None or embeddings is None or len(df) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No connections loaded. Please upload your LinkedIn Connections.csv to generate recommendations."
        )

    return rank_candidates(df, embeddings, query)

