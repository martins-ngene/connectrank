from typing import Optional, List
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str = Field(..., examples=["healthy"])
    version: str = Field(..., examples=["1.0.0"])
    demo_profiles_indexed: int = Field(..., examples=[500])
    active_ephemeral_sessions: int = Field(..., examples=[2])
    privacy_guarantee: str = Field(..., examples=["Zero-persistence. User PII is processed purely in RAM and never stored to disk."])

class RecommendationResponse(BaseModel):
    name: str = Field(..., description="Candidate Full Name")
    position: str = Field(..., description="Current Job Title")
    company: str = Field(..., description="Company Name")
    url: str = Field(..., description="LinkedIn Profile URL")
    score: float = Field(..., description="Composite match score out of 100", examples=[88.4])
    semantic_match_pct: float = Field(..., description="Semantic cosine similarity percentage", examples=[82.1])
    authority_weight: float = Field(..., description="Seniority authority weight between 0.1 and 1.0", examples=[1.0])
    seniority_tier: str = Field(..., description="Seniority classification label", examples=["Direct Decision Maker"])
    reason: str = Field(..., description="Human-readable breakdown of the score components")
    is_remote_friendly: bool = Field(default=False, description="Whether connection company or role indicates remote / worldwide hiring")
    remote_label: Optional[str] = Field(default=None, description="Classification label for remote / global hiring")

class RecommendationQuery(BaseModel):
    pitch: str = Field(..., min_length=2, description="Target role pitch, e.g., 'Senior Backend Engineer Python AWS'")
    top_k: int = Field(default=15, ge=1, le=100, description="Number of top ranked candidates to return")
    semantic_weight: float = Field(default=0.6, ge=0.0, le=1.0, description="Weight of semantic similarity (0.0 - 1.0)")
    authority_weight: float = Field(default=0.4, ge=0.0, le=1.0, description="Weight of authority decision-maker heuristic (0.0 - 1.0)")
    session_id: Optional[str] = Field(default=None, description="Optional ephemeral session ID for uploaded CSV")
    min_authority: Optional[float] = Field(default=None, ge=0.0, le=1.0, description="Optional minimum authority threshold")
    remote_only: bool = Field(default=False, description="Filter only connections in companies hiring for remote, anywhere, worldwide, or global")

class UploadResponse(BaseModel):
    session_id: str = Field(..., description="Cryptographically random ephemeral session token")
    profiles_indexed: int = Field(..., description="Total valid connection profiles parsed and embedded")
    seconds_until_expiry: int = Field(..., description="Time until this session and its memory footprint are purged")
    message: str = Field(..., description="Status description")
    privacy_notice: str = Field(
        default="Zero-persistence guarantee: Your uploaded connections are held only in RAM and will be purged automatically after 30 minutes of inactivity or when you click 'Purge My Data'. No files were written to disk."
    )

class SessionStatusResponse(BaseModel):
    session_id: str
    total_profiles: int
    seconds_until_expiry: int
    is_ephemeral: bool

class PurgeResponse(BaseModel):
    session_id: str
    purged: bool
    message: str
