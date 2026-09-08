import pytest
import numpy as np
import pandas as pd
from unittest.mock import patch
from src.models.schemas import RecommendationQuery
from src.services.ranking_service import rank_candidates

@pytest.fixture
def mock_candidates():
    df = pd.DataFrame({
        "First Name": ["Sarah", "Alex", "David"],
        "Last Name": ["Connor", "Mercer", "Bowman"],
        "Company": ["Cyberdyne", "Prototech", "Discovery"],
        "Position": ["CTO", "Software Engineer", "VP of Engineering"],
        "URL": ["https://linkedin.com/in/sarah", "https://linkedin.com/in/alex", "https://linkedin.com/in/david"],
        "authority_weight": [1.0, 0.1, 1.0],
        "seniority_tier": ["Direct Decision Maker", "Team Member", "Direct Decision Maker"],
        "profile_doc": ["CTO at Cyberdyne", "Software Engineer at Prototech", "VP of Engineering at Discovery"]
    })
    # Unit vectors
    embeddings = np.array([
        [1.0, 0.0, 0.0],  # Sarah: high match to [1, 0, 0]
        [0.0, 1.0, 0.0],  # Alex: low match to [1, 0, 0]
        [0.8, 0.2, 0.0],  # David: medium match
    ])
    return df, embeddings

def test_rank_candidates_sorting(mock_candidates):
    df, embeddings = mock_candidates
    query = RecommendationQuery(
        pitch="Targeting CTO Roles",
        top_k=2,
        semantic_weight=0.6,
        authority_weight=0.4
    )

    with patch("src.services.ranking_service.embedding_service.encode_query") as mock_encode:
        # Mock user query vector matching Sarah best
        mock_encode.return_value = np.array([[1.0, 0.0, 0.0]])
        results = rank_candidates(df, embeddings, query)

    assert len(results) == 2
    assert results[0].name == "Sarah Connor"
    assert results[0].score >= results[1].score
    assert results[0].seniority_tier == "Direct Decision Maker"

def test_authority_filtering(mock_candidates):
    df, embeddings = mock_candidates
    # Only allow decision makers >= 0.7
    query = RecommendationQuery(
        pitch="General Search",
        top_k=5,
        min_authority=0.7
    )

    with patch("src.services.ranking_service.embedding_service.encode_query") as mock_encode:
        mock_encode.return_value = np.array([[1.0, 0.0, 0.0]])
        results = rank_candidates(df, embeddings, query)

    assert len(results) == 2  # Sarah and David
    assert all(r.authority_weight >= 0.7 for r in results)
