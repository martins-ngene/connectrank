import re
from typing import Tuple, Optional, Set

# Curated registry of verified remote-first, work-from-anywhere, and worldwide-hiring tech employers
KNOWN_REMOTE_COMPANIES: Set[str] = {
    "gitlab",
    "automattic",
    "wordpress",
    "zapier",
    "buffer",
    "canonical",
    "duckduckgo",
    "basecamp",
    "37signals",
    "ghost",
    "doist",
    "toggl",
    "remote",
    "remote.com",
    "deel",
    "oyster",
    "oysterhr",
    "hootsuite",
    "elastic",
    "elasticsearch",
    "wikimedia",
    "wikimedia foundation",
    "mozilla",
    "vercel",
    "supabase",
    "cloudflare",
    "grafana",
    "grafana labs",
    "sourcegraph",
    "hashicorp",
    "red hat",
    "shopify",
    "kraken",
    "coinbase",
    "binance",
    "polygon",
    "chainlink",
    "consensys",
    "ethereum foundation",
    "postman",
    "webflow",
    "docker",
    "datadog",
    "stripe",
    "atlassian",
    "airbnb",
    "spotify",
    "dropbox",
    "okta",
    "hotjar",
    "clevertech",
    "10up",
    "toptal",
    "turing",
    "andela",
    "crossover",
    "aha!",
    "invision",
    "loom",
    "bitovi",
    "x-team",
    "scalac",
    "proxify",
    "braintrust",
    "superside",
    "kinsta",
    "wp engine",
    "modern treasury",
    "float",
    "help scout",
    "close",
    "github",
    "replit",
    "hugging face",
    "scale ai",
    "elevenlabs",
    "fly.io",
    "railway",
    "render",
    "upstash",
    "neon",
    "prisma",
    "hasura",
    "planetscale",
    "cockroachdb",
    "clickhouse",
    "linear",
    "raycast",
    "retool",
    "cursor",
    "weights & biases",
    "modal",
    "runpod",
    "brex",
    "ramp",
    "mercury",
    "gusto",
    "rippling",
    "papaya global",
    "omnipresent",
    "velocity global",
    "plane",
}

# Regex to detect remote / worldwide / global hiring indicators in Company names
COMPANY_REMOTE_REGEX = re.compile(
    r"\b(remote|distributed|worldwide|global|anywhere|virtual|borderless|nomad|decentralized|telework)\b",
    re.IGNORECASE
)

# Regex to detect remote / worldwide / global hiring indicators in Position / Job Titles
POSITION_REMOTE_REGEX = re.compile(
    r"\b(remote|work\s+from\s+anywhere|wfa|worldwide|global|anywhere|distributed|international|emea|apac|latam|americas)\b",
    re.IGNORECASE
)

def normalize_company_name(company: str) -> str:
    """Normalizes company name for exact and token matching by stripping legal suffixes and punctuation."""
    if not company:
        return ""
    # Strip legal entity suffixes and extra spaces
    cleaned = re.sub(r"[,\.]", "", company.strip().lower())
    cleaned = re.sub(r"\b(inc|llc|ltd|corp|corporation|technologies|tech|gmbh|co)\b", "", cleaned).strip()
    return cleaned

def classify_remote_friendly(company: str, position: str) -> Tuple[bool, Optional[str]]:
    """
    Evaluates whether a candidate's company or position indicates remote, anywhere,
    worldwide, or global hiring.
    
    Returns (is_remote_friendly, label_reason).
    """
    comp_clean = (company or "").strip()
    pos_clean = (position or "").strip()

    if not comp_clean and not pos_clean:
        return False, None

    normalized_comp = normalize_company_name(comp_clean)
    
    # 1. Check known remote-first / worldwide hiring registry
    if normalized_comp in KNOWN_REMOTE_COMPANIES:
        return True, "Remote-First Organization"
    
    # Also check if any known employer key is in normalized name (e.g. 'gitlab inc' -> 'gitlab')
    for known in KNOWN_REMOTE_COMPANIES:
        if known == normalized_comp or (len(known) >= 5 and known in normalized_comp):
            return True, "Remote-First Organization"

    # 2. Check company name keywords (e.g., 'Global Talent', 'Remote Systems', 'Worldwide Logistics')
    if COMPANY_REMOTE_REGEX.search(comp_clean):
        return True, "Worldwide / Global Company"

    # 3. Check position title keywords (e.g. 'Software Engineer (Remote)', 'Global Tech Lead', 'Worldwide')
    if POSITION_REMOTE_REGEX.search(pos_clean):
        return True, "Remote / Global Role"

    return False, None
