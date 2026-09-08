import pytest
from src.services.heuristics_service import classify_title, get_authority_weight, get_seniority_tier

def test_tier_1_decision_makers():
    tier_1_titles = [
        "Founder & CEO",
        "Co-Founder & CTO",
        "VP of Engineering",
        "Head of People",
        "Technical Recruiter",
        "Talent Acquisition Partner",
        "Chief Technology Officer"
    ]
    for title in tier_1_titles:
        weight, tier = classify_title(title)
        assert weight == 1.0, f"Expected 1.0 for '{title}', got {weight}"
        assert tier == "Direct Decision Maker"

def test_tier_2_engineering_leads():
    tier_2_titles = [
        "Engineering Manager",
        "Director of Infrastructure",
        "Solutions Architect",
        "Tech Lead",
        "Software Architect"
    ]
    for title in tier_2_titles:
        weight, tier = classify_title(title)
        assert weight == 0.7, f"Expected 0.7 for '{title}', got {weight}"
        assert tier == "Engineering Lead"

def test_tier_3_senior_peers():
    tier_3_titles = [
        "Senior Backend Engineer",
        "Staff Software Engineer",
        "Principal Systems Engineer"
    ]
    for title in tier_3_titles:
        weight, tier = classify_title(title)
        assert weight == 0.4, f"Expected 0.4 for '{title}', got {weight}"
        assert tier == "Senior Peer Referral"

def test_fallback_team_members():
    fallback_titles = [
        "Software Engineer",
        "Intern",
        "Marketing Specialist",
        "",
        None
    ]
    for title in fallback_titles:
        weight, tier = classify_title(title)
        assert weight == 0.1, f"Expected 0.1 fallback for '{title}', got {weight}"
        assert tier == "Team Member"
