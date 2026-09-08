import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import numpy as np
import pandas as pd
from src.main import app

client = TestClient(app)

SAMPLE_CSV_CONTENT = """Notes:
Some note line 1
Some note line 2
First Name,Last Name,URL,Company,Position,Connected On
Grace,Hopper,https://linkedin.com/in/grace,Navy,Director of Research,01/01/1950
Linus,Torvalds,https://linkedin.com/in/linus,Linux Foundation,Chief Architect,01/01/1991
"""

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "privacy_guarantee" in data

def test_upload_and_recommend_lifecycle():
    # 1. Upload sample CSV
    files = {"file": ("Connections.csv", SAMPLE_CSV_CONTENT.encode("utf-8"), "text/csv")}
    upload_res = client.post("/upload", files=files)
    assert upload_res.status_code == 201
    upload_data = upload_res.json()
    assert "session_id" in upload_data
    assert upload_data["profiles_indexed"] == 2
    session_id = upload_data["session_id"]

    # 2. Query session status
    status_res = client.get(f"/session/{session_id}")
    assert status_res.status_code == 200
    assert status_res.json()["total_profiles"] == 2

    # 3. Request recommendations using session_id
    recommend_res = client.post(
        f"/recommend?pitch=Systems+Architect&session_id={session_id}&top_k=5"
    )
    assert recommend_res.status_code == 200
    candidates = recommend_res.json()
    assert len(candidates) == 2
    assert any("Linus" in c["name"] for c in candidates)

    # 4. Purge session (Right to Erasure)
    purge_res = client.post(f"/session/purge?session_id={session_id}")
    assert purge_res.status_code == 200
    assert purge_res.json()["purged"] is True

    # 5. Verify session is no longer accessible
    expired_check = client.get(f"/session/{session_id}")
    assert expired_check.status_code == 404

def test_upload_invalid_file_type():
    files = {"file": ("resume.pdf", b"%PDF-1.4...", "application/pdf")}
    res = client.post("/upload", files=files)
    assert res.status_code == 400

def test_recommend_missing_pitch():
    res = client.post("/recommend")
    assert res.status_code == 400
