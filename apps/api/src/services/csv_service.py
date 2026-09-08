import io
from typing import Tuple
import pandas as pd
from src.services.heuristics_service import annotate_dataframe_with_heuristics

REQUIRED_COLUMNS = ["Position", "Company"]
DESIRED_COLUMNS = ["First Name", "Last Name", "URL", "Company", "Position", "Connected On"]

class CSVProcessingError(Exception):
    pass

def parse_linkedin_csv_bytes(file_bytes: bytes) -> pd.DataFrame:
    """
    Parses raw bytes of a LinkedIn Connections.csv upload in memory.
    Handles LinkedIn's preamble (skipping initial comment rows if present).
    Guaranteed strictly in-memory (RAM only) processing for GDPR compliance.
    """
    try:
        content_str = file_bytes.decode("utf-8", errors="replace")
    except Exception as e:
        raise CSVProcessingError(f"Could not decode file content as text: {str(e)}")

    lines = content_str.splitlines()
    if not lines:
        raise CSVProcessingError("Uploaded CSV file is empty.")

    # Detect header line: LinkedIn CSVs usually start with notes or comments
    # We look for the line that contains 'Position' or 'Company'
    header_idx = 0
    for idx, line in enumerate(lines[:10]):
        line_lower = line.lower()
        if "position" in line_lower and "company" in line_lower:
            header_idx = idx
            break

    try:
        csv_data = "\n".join(lines[header_idx:])
        df = pd.read_csv(io.StringIO(csv_data))
    except Exception as e:
        raise CSVProcessingError(f"Failed to parse CSV tabular structure: {str(e)}")

    # Normalize column names by stripping whitespace
    df.columns = [c.strip() for c in df.columns]

    # Verify required columns exist
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise CSVProcessingError(
            f"CSV is missing required LinkedIn columns: {missing}. Expected columns: 'Position', 'Company', 'First Name', 'Last Name', 'URL'."
        )

    # Standardize columns: create missing optional ones if absent
    for col in DESIRED_COLUMNS:
        if col not in df.columns:
            df[col] = ""

    # Drop rows without role or company
    df = df.dropna(subset=REQUIRED_COLUMNS)
    # Also drop rows where Position or Company is blank whitespace
    df = df[df["Position"].astype(str).str.strip().ne("") & df["Company"].astype(str).str.strip().ne("")]

    if len(df) == 0:
        raise CSVProcessingError("No valid connection profiles with both Position and Company found in CSV.")

    # Create profile search document
    df["profile_doc"] = df["Position"].astype(str).str.strip() + " at " + df["Company"].astype(str).str.strip()

    # Apply heuristics
    df = annotate_dataframe_with_heuristics(df)
    df.reset_index(drop=True, inplace=True)

    return df
