import re
from typing import Tuple
import pandas as pd

SENIORITY_RULES = [
    (
        1.0,
        re.compile(r"\b(founder|co-founder|cto|vp of engineering|head of|recruiter|talent acquisition|chief\s+\w+\s+officer|ceo|president)\b", re.I),
        "Direct Decision Maker"
    ),
    (
        0.7,
        re.compile(r"\b(director|engineering manager|tech lead|team lead|lead|solutions architect|software architect|architect)\b", re.I),
        "Engineering Lead"
    ),
    (
        0.4,
        re.compile(r"\b(senior|staff|principal)\b", re.I),
        "Senior Peer Referral"
    ),
]

DEFAULT_WEIGHT = 0.1
DEFAULT_TIER = "Team Member"

def classify_title(title: str) -> Tuple[float, str]:
    """
    Evaluates a job title against deterministic regex authority rules.
    Returns (authority_weight, tier_label).
    """
    if not isinstance(title, str) or not title.strip():
        return DEFAULT_WEIGHT, DEFAULT_TIER
    
    clean_title = title.strip()
    for weight, pattern, tier in SENIORITY_RULES:
        if pattern.search(clean_title):
            return weight, tier
            
    return DEFAULT_WEIGHT, DEFAULT_TIER

def get_authority_weight(title: str) -> float:
    return classify_title(title)[0]

def get_seniority_tier(title: str) -> str:
    return classify_title(title)[1]

from src.services.remote_service import classify_remote_friendly

def annotate_dataframe_with_heuristics(df: pd.DataFrame) -> pd.DataFrame:
    """Enriches dataframe with authority weights, seniority tier classifications, and remote-friendly indicators."""
    weights_and_tiers = df["Position"].apply(classify_title)
    df["authority_weight"] = [wt[0] for wt in weights_and_tiers]
    df["seniority_tier"] = [wt[1] for wt in weights_and_tiers]

    remote_data = [
        classify_remote_friendly(str(row.get("Company", "")), str(row.get("Position", "")))
        for _, row in df.iterrows()
    ]
    df["is_remote_friendly"] = [rd[0] for rd in remote_data]
    df["remote_label"] = [rd[1] for rd in remote_data]
    return df
