import time
import uuid
import threading
from dataclasses import dataclass
from typing import Dict, Optional
import numpy as np
import pandas as pd
from src.core.config import settings

@dataclass
class SessionData:
    session_id: str
    df: pd.DataFrame
    embeddings: np.ndarray
    total_profiles: int
    created_at: float
    last_accessed_at: float

class SessionManager:
    """
    Thread-safe in-memory session manager with automatic TTL eviction.
    Enforces a strict zero-persistence policy: user data (PII) is stored
    strictly in memory for the duration of the session and never written to disk.
    """
    def __init__(self, ttl_minutes: int = settings.session_ttl_minutes):
        self._ttl_seconds = ttl_minutes * 60
        self._sessions: Dict[str, SessionData] = {}
        self._lock = threading.Lock()

    def create_session(self, df: pd.DataFrame, embeddings: np.ndarray) -> str:
        """Create a new ephemeral session with precomputed embeddings."""
        self.cleanup_expired_sessions()
        session_id = str(uuid.uuid4())
        now = time.time()
        
        session = SessionData(
            session_id=session_id,
            df=df,
            embeddings=embeddings,
            total_profiles=len(df),
            created_at=now,
            last_accessed_at=now
        )
        
        with self._lock:
            self._sessions[session_id] = session
            
        return session_id

    def get_session(self, session_id: str) -> Optional[SessionData]:
        """Retrieve session and refresh its last accessed timestamp."""
        with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                return None
            
            # Check expiration
            if (time.time() - session.last_accessed_at) > self._ttl_seconds:
                del self._sessions[session_id]
                return None
            
            session.last_accessed_at = time.time()
            return session

    def purge_session(self, session_id: str) -> bool:
        """Explicitly purge a user's session data from memory immediately (Right to erasure)."""
        with self._lock:
            if session_id in self._sessions:
                del self._sessions[session_id]
                return True
            return False

    def cleanup_expired_sessions(self) -> int:
        """Remove all sessions exceeding the inactivity TTL."""
        now = time.time()
        expired_keys = []
        with self._lock:
            for sid, sdata in self._sessions.items():
                if (now - sdata.last_accessed_at) > self._ttl_seconds:
                    expired_keys.append(sid)
            for sid in expired_keys:
                del self._sessions[sid]
        return len(expired_keys)

    def get_session_info(self, session_id: str) -> Optional[dict]:
        """Return non-PII diagnostic metadata about an active session."""
        session = self.get_session(session_id)
        if not session:
            return None
        
        ttl_remaining = max(0, int(self._ttl_seconds - (time.time() - session.last_accessed_at)))
        return {
            "session_id": session.session_id,
            "total_profiles": session.total_profiles,
            "created_at": session.created_at,
            "seconds_until_expiry": ttl_remaining,
            "is_ephemeral": True
        }

    def active_session_count(self) -> int:
        with self._lock:
            return len(self._sessions)

# Global in-memory singleton
session_manager = SessionManager()
