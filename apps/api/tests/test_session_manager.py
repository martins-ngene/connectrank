import time
import pytest
import numpy as np
import pandas as pd
from src.core.session_manager import SessionManager

def create_sample_df():
    return pd.DataFrame({
        "First Name": ["Ada", "Alan"],
        "Last Name": ["Lovelace", "Turing"],
        "Company": ["Analytical Engine", "Bletchley"],
        "Position": ["CTO", "Lead Cryptanalyst"],
        "URL": ["https://linkedin.com/in/ada", "https://linkedin.com/in/alan"],
        "authority_weight": [1.0, 0.7],
        "seniority_tier": ["Direct Decision Maker", "Engineering Lead"],
        "profile_doc": ["CTO at Analytical Engine", "Lead Cryptanalyst at Bletchley"]
    })

def test_session_creation_and_retrieval():
    mgr = SessionManager(ttl_minutes=1)
    df = create_sample_df()
    embeddings = np.random.rand(2, 384)
    
    session_id = mgr.create_session(df, embeddings)
    assert session_id is not None
    assert mgr.active_session_count() == 1
    
    session = mgr.get_session(session_id)
    assert session is not None
    assert session.total_profiles == 2
    assert len(session.df) == 2

def test_session_purge_gdpr():
    mgr = SessionManager(ttl_minutes=1)
    df = create_sample_df()
    embeddings = np.random.rand(2, 384)
    
    session_id = mgr.create_session(df, embeddings)
    assert mgr.get_session(session_id) is not None
    
    # Explicit purge
    purged = mgr.purge_session(session_id)
    assert purged is True
    assert mgr.get_session(session_id) is None
    assert mgr.active_session_count() == 0

def test_session_ttl_expiration():
    # Session manager with 0 second TTL for instant expiration
    mgr = SessionManager(ttl_minutes=0)
    df = create_sample_df()
    embeddings = np.random.rand(2, 384)
    
    session_id = mgr.create_session(df, embeddings)
    time.sleep(0.01)
    
    # Accessing expired session returns None
    assert mgr.get_session(session_id) is None
    assert mgr.active_session_count() == 0
