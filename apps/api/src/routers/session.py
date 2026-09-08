# pyrefly: ignore [missing-import]
from fastapi import APIRouter, UploadFile, File, HTTPException, Query, status
from src.core.config import settings
from src.core.session_manager import session_manager
from src.services.csv_service import parse_linkedin_csv_bytes, CSVProcessingError
from src.services.embedding_service import embedding_service
from src.models.schemas import UploadResponse, SessionStatusResponse, PurgeResponse

router = APIRouter(tags=["Session & Ephemeral Uploads"])

@router.post(
    "/upload",
    response_model=UploadResponse,
    summary="Ephemeral LinkedIn CSV Ingestion (Zero-Persistence)",
    status_code=status.HTTP_201_CREATED
)
async def upload_connections_csv(file: UploadFile = File(...)):
    """
    Ingests a user's LinkedIn Connections.csv directly in RAM.
    Computes vector embeddings on the fly and creates a temporary in-memory session.
    
    **Privacy Guarantee:**
    - No PII (names, companies, URLs, contacts) is ever written to disk or database.
    - All data is purged automatically after 30 minutes of inactivity or immediately upon clicking 'Purge My Data'.
    """
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload a standard LinkedIn export CSV file."
        )

    # Read bytes into memory
    contents = await file.read()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.max_upload_size_mb}MB."
        )

    # In-memory CSV parsing and cleaning
    try:
        df = parse_linkedin_csv_bytes(contents)
    except CSVProcessingError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to process CSV: {str(e)}")

    # Compute dense embeddings in memory
    profile_docs = df["profile_doc"].tolist()
    embeddings = embedding_service.encode_documents(profile_docs)

    # Store in memory session
    session_id = session_manager.create_session(df, embeddings)
    ttl_seconds = settings.session_ttl_minutes * 60

    return UploadResponse(
        session_id=session_id,
        profiles_indexed=len(df),
        seconds_until_expiry=ttl_seconds,
        message=f"Successfully indexed {len(df)} connections in ephemeral memory."
    )

@router.get(
    "/session/{session_id}",
    response_model=SessionStatusResponse,
    summary="Check Ephemeral Session Expiry & Profile Count"
)
def get_session_status(session_id: str):
    """Checks whether an ephemeral session is currently active and how much TTL remains."""
    info = session_manager.get_session_info(session_id)
    if not info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or has expired from memory. Please re-upload your CSV or use Demo Mode."
        )
    return SessionStatusResponse(
        session_id=info["session_id"],
        total_profiles=info["total_profiles"],
        seconds_until_expiry=info["seconds_until_expiry"],
        is_ephemeral=True
    )

@router.post(
    "/session/purge",
    response_model=PurgeResponse,
    summary="Purge Ephemeral Session (GDPR Right to Erasure)"
)
def purge_session(session_id: str = Query(..., description="The session ID to purge")):
    """
    Immediately discards the user's uploaded connections and vectors from server RAM.
    Fulfills the GDPR Article 17 Right to Erasure.
    """
    success = session_manager.purge_session(session_id)
    if not success:
        return PurgeResponse(
            session_id=session_id,
            purged=False,
            message="Session already expired or does not exist."
        )
    return PurgeResponse(
        session_id=session_id,
        purged=True,
        message="Session and all associated connection profiles were successfully purged from server memory."
    )
