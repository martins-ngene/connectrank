import os
import re
import numpy as np
import pandas as pd
from fastapi import FastAPI, Query
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="LinkedIn Gig Recommender")

# Load model and data once at startup
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
model = SentenceTransformer(MODEL_NAME)
df = pd.read_parquet("cleaned_connections.parquet")

# Precompute embeddings for all connections in memory
print("Computing connection embeddings...")
doc_embeddings = model.encode(df["profile_doc"].tolist(), normalize_embeddings=True, show_progress_bar=False)

# Seniority weights
SENIORITY_PATTERNS = {
    1.0: re.compile(r"\b(founder|co-founder|cto|vp of engineering|head of|recruiter|talent acquisition)\b", re.I),
    0.7: re.compile(r"\b(director|engineering manager|lead|architect)\b", re.I),
    0.4: re.compile(r"\b(senior|staff|principal)\b", re.I)
}

def get_authority_weight(title: str) -> float:
    for weight, pattern in SENIORITY_PATTERNS.items():
        if pattern.search(title):
            return weight
    return 0.1

df["authority_weight"] = df["Position"].apply(get_authority_weight)

class RecommendationResponse(BaseModel):
    name: str
    position: str
    company: str
    url: str
    score: float
    reason: str

@app.get("/health")
def health():
    return {"status": "healthy", "profiles_indexed": len(df)}

@app.post("/recommend", response_model=list[RecommendationResponse])
def recommend(
    pitch: str = Query(..., description="Target role query, e.g., 'Senior Backend Engineer Python AWS'"),
    top_k: int = 15
):
    # 1. Embed user query
    query_vec = model.encode([pitch], normalize_embeddings=True)
    
    # 2. Compute semantic similarity (dot product on normalized vectors)
    similarities = cosine_similarity(query_vec, doc_embeddings)[0]
    
    # 3. Composite score: 60% semantic match + 40% decision power
    final_scores = (similarities * 0.6) + (df["authority_weight"].to_numpy() * 0.4)
    
    # 4. Rank top K
    top_indices = np.argsort(final_scores)[::-1][:top_k]
    
    results = []
    for idx in top_indices:
        results.append(RecommendationResponse(
            name=f"{df.iloc[idx]['First Name']} {df.iloc[idx]['Last Name']}",
            position=df.iloc[idx]["Position"],
            company=df.iloc[idx]["Company"],
            url=str(df.iloc[idx]["URL"]),
            score=round(float(final_scores[idx]) * 100, 1),
            reason=f"Semantic match: {round(float(similarities[idx])*100, 1)}% | Decision weight: {df.iloc[idx]['authority_weight']}"
        ))
    return results