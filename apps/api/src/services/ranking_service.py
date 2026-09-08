from typing import List, Optional
# pyrefly: ignore [missing-import]
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from src.models.schemas import RecommendationResponse, RecommendationQuery
from src.services.embedding_service import embedding_service

def rank_candidates(
    df: pd.DataFrame,
    doc_embeddings: np.ndarray,
    query: RecommendationQuery
) -> List[RecommendationResponse]:
    """
    Ranks candidate profiles using a weighted composite of dense semantic similarity
    and deterministic authority decision weights.
    """
    if len(df) == 0 or len(doc_embeddings) == 0:
        return []

    # 1. Embed user pitch query
    query_vec = embedding_service.encode_query(query.pitch)

    # 2. Compute cosine similarity
    similarities = cosine_similarity(query_vec, doc_embeddings)[0]

    # Normalize weights so they sum to 1.0
    w_semantic = query.semantic_weight
    w_authority = query.authority_weight
    total_w = w_semantic + w_authority
    if total_w > 0:
        norm_w_sem = w_semantic / total_w
        norm_w_auth = w_authority / total_w
    else:
        norm_w_sem = 0.6
        norm_w_auth = 0.4

    # 3. Composite score calculation
    authority_weights = df["authority_weight"].to_numpy(dtype=float)
    final_scores = (similarities * norm_w_sem) + (authority_weights * norm_w_auth)

    # 4. Optional threshold and remote filtering
    valid_indices = np.arange(len(df))
    if query.min_authority is not None:
        mask = authority_weights >= query.min_authority
        valid_indices = valid_indices[mask]
        if len(valid_indices) == 0:
            return []

    if query.remote_only:
        if "is_remote_friendly" in df.columns:
            remote_mask = df["is_remote_friendly"].to_numpy(dtype=bool)
        else:
            from src.services.remote_service import classify_remote_friendly
            remote_mask = np.array([
                classify_remote_friendly(str(r.get("Company", "")), str(r.get("Position", "")))[0]
                for _, r in df.iterrows()
            ], dtype=bool)
        valid_indices = np.intersect1d(valid_indices, np.where(remote_mask)[0])
        if len(valid_indices) == 0:
            return []

    # 5. Sort descending
    subset_scores = final_scores[valid_indices]
    sorted_order = np.argsort(subset_scores)[::-1]
    top_indices = valid_indices[sorted_order[: query.top_k]]

    # 6. Format response items
    results: List[RecommendationResponse] = []
    for idx in top_indices:
        row = df.iloc[idx]
        sem_score = float(similarities[idx])
        auth_weight = float(row.get("authority_weight", 0.1))
        comp_score = float(final_scores[idx])
        tier = str(row.get("seniority_tier", "Team Member"))

        # Format percentages
        sem_pct = round(max(0.0, min(100.0, sem_score * 100)), 1)
        score_100 = round(max(0.0, min(100.0, comp_score * 100)), 1)

        first_name = str(row.get("First Name", "")).strip()
        last_name = str(row.get("Last Name", "")).strip()
        full_name = f"{first_name} {last_name}".strip() or "LinkedIn Connection"
        
        position = str(row.get("Position", "Unknown Position")).strip()
        company = str(row.get("Company", "Unknown Company")).strip()
        url = str(row.get("URL", "")).strip()

        is_remote_val = row.get("is_remote_friendly", False)
        is_remote = bool(is_remote_val) if pd.notna(is_remote_val) else False

        raw_label = row.get("remote_label", None)
        remote_lbl = str(raw_label).strip() if (pd.notna(raw_label) and str(raw_label).strip() and str(raw_label).lower() != "nan") else None

        if not is_remote and remote_lbl is None and "is_remote_friendly" not in row:
            from src.services.remote_service import classify_remote_friendly
            is_remote, remote_lbl = classify_remote_friendly(company, position)

        reason = (
            f"Semantic Relevance: {sem_pct}% ({int(norm_w_sem*100)}% weight) | "
            f"Authority: {auth_weight} ({tier}, {int(norm_w_auth*100)}% weight)"
        )
        if is_remote and remote_lbl:
            reason += f" | {remote_lbl}"

        results.append(
            RecommendationResponse(
                name=full_name,
                position=position,
                company=company,
                url=url,
                score=score_100,
                semantic_match_pct=sem_pct,
                authority_weight=auth_weight,
                seniority_tier=tier,
                reason=reason,
                is_remote_friendly=is_remote,
                remote_label=remote_lbl
            )
        )

    return results
