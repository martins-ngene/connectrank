# pyrefly: ignore [missing-import]
import pytest
import pandas as pd
# pyrefly: ignore [missing-import]
import numpy as np
from src.services.remote_service import classify_remote_friendly
from src.services.heuristics_service import annotate_dataframe_with_heuristics
from src.services.ranking_service import rank_candidates
from src.models.schemas import RecommendationQuery

def test_known_remote_companies():
    is_remote, label = classify_remote_friendly("GitLab", "Backend Engineer")
    assert is_remote is True
    assert label == "Remote-First Organization"

    is_remote, label = classify_remote_friendly("Automattic Inc.", "Senior Designer")
    assert is_remote is True
    assert label == "Remote-First Organization"

    is_remote, label = classify_remote_friendly("Canonical Ltd", "Kernel Developer")
    assert is_remote is True
    assert label == "Remote-First Organization"

    is_remote, label = classify_remote_friendly("Zapier", "Staff Engineer")
    assert is_remote is True
    assert label == "Remote-First Organization"

def test_company_regex_remote():
    is_remote, label = classify_remote_friendly("Global Talent Technologies", "HR Specialist")
    assert is_remote is True
    assert label == "Worldwide / Global Company"

    is_remote, label = classify_remote_friendly("Worldwide Logistics Corp", "Product Manager")
    assert is_remote is True
    assert label == "Worldwide / Global Company"

    is_remote, label = classify_remote_friendly("Decentralized Cloud Solutions", "Architect")
    assert is_remote is True
    assert label == "Worldwide / Global Company"

def test_position_regex_remote():
    is_remote, label = classify_remote_friendly("Acme Corp", "Senior Python Engineer (Remote)")
    assert is_remote is True
    assert label == "Remote / Global Role"

    is_remote, label = classify_remote_friendly("Local Bakery", "Director of Worldwide Operations")
    assert is_remote is True
    assert label == "Remote / Global Role"

    is_remote, label = classify_remote_friendly("Tech Corp", "Engineering Lead - Work from Anywhere")
    assert is_remote is True
    assert label == "Remote / Global Role"

def test_non_remote_negative_control():
    is_remote, label = classify_remote_friendly("Local Dental Office", "Office Assistant")
    assert is_remote is False
    assert label is None

    is_remote, label = classify_remote_friendly("Acme Hardware", "Floor Manager")
    assert is_remote is False
    assert label is None

def test_ranking_service_remote_filter():
    df = pd.DataFrame([
        {
            "First Name": "Alice",
            "Last Name": "Remote",
            "Company": "GitLab",
            "Position": "VP of Engineering",
            "URL": "https://linkedin.com/in/alice"
        },
        {
            "First Name": "Bob",
            "Last Name": "Local",
            "Company": "Joe's Coffee Shop",
            "Position": "Barista",
            "URL": "https://linkedin.com/in/bob"
        },
        {
            "First Name": "Carol",
            "Last Name": "Global",
            "Company": "Worldwide Solutions",
            "Position": "Tech Lead",
            "URL": "https://linkedin.com/in/carol"
        }
    ])
    df = annotate_dataframe_with_heuristics(df)
    
    # 3 mock embeddings of length 4
    embeddings = np.array([
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.7, 0.7, 0.0, 0.0]
    ])

    # Unfiltered search
    all_query = RecommendationQuery(pitch="Python Engineer", top_k=10, remote_only=False)
    # Monkey-patch query vector to match Alice
    import src.services.ranking_service as rs
    orig_encode = rs.embedding_service.encode_query
    rs.embedding_service.encode_query = lambda q: np.array([[1.0, 0.0, 0.0, 0.0]])
    try:
        all_results = rank_candidates(df, embeddings, all_query)
        assert len(all_results) == 3

        # Remote-only filtered search
        remote_query = RecommendationQuery(pitch="Python Engineer", top_k=10, remote_only=True)
        remote_results = rank_candidates(df, embeddings, remote_query)
        assert len(remote_results) == 2
        # Verify only Alice (GitLab) and Carol (Worldwide Solutions) are present
        names = [r.name for r in remote_results]
        assert "Alice Remote" in names
        assert "Carol Global" in names
        assert "Bob Local" not in names
        
        # Verify remote metadata in response
        alice_res = next(r for r in remote_results if "Alice" in r.name)
        assert alice_res.is_remote_friendly is True
        assert alice_res.remote_label == "Remote-First Organization"
    finally:
        rs.embedding_service.encode_query = orig_encode
