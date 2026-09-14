import pytest
import pandas as pd
from fastapi.testclient import TestClient
from src.main import app
from src.services.demo_data_service import generate_synthetic_demo_dataframe
from src.services.heuristics_service import annotate_dataframe_with_heuristics

@pytest.fixture(scope="module")
def client():
    """Test client fixture that activates FastAPI lifespan context manager."""
    with TestClient(app) as c:
        yield c

def test_synthetic_demo_dataframe_structure():
    """Verify the synthetic demo generator produces all required fields and obvious mock personas."""
    df = generate_synthetic_demo_dataframe()
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 4

    expected_cols = ["First Name", "Last Name", "URL", "Company", "Position", "Connected On", "profile_doc"]
    for col in expected_cols:
        assert col in df.columns, f"Missing expected column: {col}"

    # Verify explicitly requested demo personas are present
    full_names = (df["First Name"] + " " + df["Last Name"]).tolist()
    assert any("John Doe" in name for name in full_names), "John Doe must be in demo dataset"
    assert any("Jane Doe" in name for name in full_names), "Jane Doe must be in demo dataset"
    assert any("Janet Joe" in name for name in full_names), "Janet Joe must be in demo dataset"

    # Verify all companies are mock/demo companies
    companies = df["Company"].tolist()
    assert all("demo" in c.lower() or "remote" in c.lower() or "mock" in c.lower() or "example" in c.lower() or "placeholder" in c.lower() for c in companies)

def test_synthetic_demo_heuristics_annotation():
    """Verify that heuristic classification properly categorizes synthetic profiles."""
    df = generate_synthetic_demo_dataframe()
    df = annotate_dataframe_with_heuristics(df)

    assert "authority_weight" in df.columns
    assert "seniority_tier" in df.columns
    assert "is_remote_friendly" in df.columns

    tiers = set(df["seniority_tier"].unique())
    assert "Direct Decision Maker" in tiers
    assert "Engineering Lead" in tiers
    assert "Senior Peer Referral" in tiers
    assert "Team Member" in tiers

def test_health_reports_synthetic_demo_profiles(client):
    """Ensure /health endpoint returns the indexed count of synthetic demo profiles."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["demo_profiles_indexed"] == 4

def test_demo_mode_recommendations_without_session_id(client):
    """Verify that requesting recommendations without a session_id ranks synthetic profiles."""
    response = client.post("/recommend?pitch=Senior+Backend+Engineer+Python+AWS&top_k=5")
    assert response.status_code == 200
    candidates = response.json()
    assert len(candidates) == 4

    # Check that candidate names are synthetic (e.g. John Doe, Jane Doe, Janet Joe, etc.)
    names = [c["name"] for c in candidates]
    assert any("Doe" in name or "Joe" in name or "Demo" in name for name in names)

    # Verify scores and reasons are generated
    for c in candidates:
        assert "score" in c
        assert "reason" in c
        assert "seniority_tier" in c

def test_demo_mode_remote_filter(client):
    """Verify remote-only filtering works on the synthetic demo dataset."""
    response = client.post("/recommend?pitch=Software+Engineer&remote_only=true&top_k=5")
    assert response.status_code == 200
    candidates = response.json()
    assert len(candidates) > 0
    for c in candidates:
        assert c["is_remote_friendly"] is True

def test_demo_mode_min_authority_filter(client):
    """Verify min_authority filtering works on the synthetic demo dataset."""
    response = client.post("/recommend?pitch=Cloud+Architect&min_authority=0.7&top_k=5")
    assert response.status_code == 200
    candidates = response.json()
    assert len(candidates) > 0
    for c in candidates:
        assert c["seniority_tier"] in ["Direct Decision Maker", "Engineering Lead"]
