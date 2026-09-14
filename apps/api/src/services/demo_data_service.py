"""
Synthetic Demo Data Generation Service for ConnectRank.
Generates an in-memory, zero-persistence dataset of exactly 4 obviously mock LinkedIn connection profiles
(featuring John Doe, Jane Doe, Janet Joe, and obvious demo identities) for zero-risk demo mode.
"""
from typing import List, Dict
import pandas as pd

# Exactly 4 explicitly mock profiles featuring John Doe, Jane Doe, Janet Joe across all 4 heuristic tiers
SYNTHETIC_PROFILES: List[Dict[str, str]] = [
    {
        "First Name": "Jane",
        "Last Name": "Doe",
        "Company": "DemoTech Solutions",
        "Position": "CEO / Founder",
        "URL": "https://www.linkedin.com/in/demo-jane-doe",
        "Connected On": "01/15/2022",
    },
    {
        "First Name": "Janet",
        "Last Name": "Joe",
        "Company": "Example Cloud Systems (Remote)",
        "Position": "Technical Talent Lead",
        "URL": "https://www.linkedin.com/in/demo-janet-joe",
        "Connected On": "06/20/2022",
    },
    {
        "First Name": "John",
        "Last Name": "Doe",
        "Company": "Acme Corp (Demo)",
        "Position": "Senior Backend Engineer (Python / AWS)",
        "URL": "https://www.linkedin.com/in/demo-john-doe",
        "Connected On": "03/12/2023",
    },
    {
        "First Name": "John",
        "Last Name": "Doe (Junior)",
        "Company": "Placeholder Labs (Demo)",
        "Position": "Junior Software Engineer",
        "URL": "https://www.linkedin.com/in/demo-john-doe-jr",
        "Connected On": "09/14/2023",
    },
]

def generate_synthetic_demo_dataframe() -> pd.DataFrame:
    """
    Constructs a deterministic, in-memory synthetic demo DataFrame capped at 4 mock profiles.
    Guaranteed zero-persistence and 100% anonymized/mock profiles featuring
    John Doe, Jane Doe, and Janet Joe.
    """
    df = pd.DataFrame(SYNTHETIC_PROFILES)
    df["profile_doc"] = (
        df["Position"].astype(str).str.strip() + " at " + df["Company"].astype(str).str.strip()
    )
    return df
