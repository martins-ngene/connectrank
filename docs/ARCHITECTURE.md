# System Architecture & Technical Specification

This document provides a comprehensive technical overview of the **LinkedIn Cold DM Recommender Engine**, covering system design, ephemeral memory management, the composite scoring model, and cloud deployment topology.

---

## 1. High-Level System Architecture

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'darkMode': true,
    'background': '#0b0f19',
    'primaryColor': '#1e293b',
    'primaryTextColor': '#f8fafc',
    'primaryBorderColor': '#6366f1',
    'lineColor': '#818cf8',
    'secondaryColor': '#0f172a',
    'tertiaryColor': '#1e1b4b'
  }
}}%%
flowchart TB
    subgraph ClientLayer ["Client Layer (Browser)"]
        UI["React 19 + Vite SPA<br>(apps/web)"]
        DRAG["CSV Ingestion<br>Drag & Drop"]
        SLIDERS["Dynamic Weight<br>Sliders (0-100%)"]
        DM["Cold DM Template<br>Composer Modal"]
    end

    subgraph APILayer ["Backend Service (apps/api)"]
        FASTAPI["FastAPI App<br>Lifespan Engine"]
        ROUTERS["APIRouters<br>(/health, /upload, /recommend, /session)"]
        
        subgraph MemoryStore ["Strict Zero-Persistence RAM Layer (GDPR Article 17)"]
            SESSION_CACHE["In-Memory Session Manager<br>(TTL: 30 Minutes Inactivity)"]
            DEMO_CACHE["Preloaded Anonymized<br>Demo Vector Store"]
        end

        subgraph MLServices ["Inference & Heuristics Engine"]
            EMBED["SentenceTransformer Singleton<br>(all-MiniLM-L6-v2)"]
            HEUR["Seniority Regex Heuristics<br>(Decision Tiers: 1.0, 0.7, 0.4, 0.1)"]
            RANK["Cosine Similarity &<br>Composite Scoring Engine"]
        end
    end

    DRAG -->|POST /upload multipart CSV| ROUTERS
    SLIDERS -->|POST /recommend with custom weights| ROUTERS
    DM -->|Uses Candidate JSON Payload| UI
    ROUTERS --> FASTAPI
    FASTAPI --> SESSION_CACHE
    FASTAPI --> DEMO_CACHE
    ROUTERS --> RANK
    RANK --> EMBED
    RANK --> HEUR
```

---

## 2. GDPR Zero-Persistence & Ephemeral Session Lifecycle

The platform enforces a **strict privacy-by-design policy** where user data is never committed to persistent storage.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'darkMode': true,
    'background': '#0b0f19',
    'primaryColor': '#1e293b',
    'primaryTextColor': '#f8fafc',
    'primaryBorderColor': '#6366f1',
    'lineColor': '#818cf8'
  }
}}%%
sequenceDiagram
    autonumber
    actor User as User Browser
    participant API as FastAPI Router (/upload)
    participant RAM as Server RAM (SessionManager)
    participant Model as SentenceTransformer
    participant GC as Python Garbage Collector

    User->>API: Uploads Connections.csv (Multipart Form)
    API->>API: Parse CSV bytes in-memory (No file written to disk)
    API->>Model: Batch encode profile documents (Position + Company)
    Model-->>API: Normalized 384-dimensional vector embeddings
    API->>RAM: Store DataFrame + Vectors in _sessions[session_id]
    API-->>User: Returns session_id + seconds_until_expiry (1800s)

    loop Interactive Search
        User->>API: POST /recommend?pitch=...&session_id=...
        API->>RAM: Retrieve session & refresh last_accessed_at
        API->>Model: Encode pitch query
        API->>API: Compute Cosine Similarity & Authority Weights
        API-->>User: Top-K Ranked Candidate Cards
    end

    alt Explicit Purge (Right to Erasure)
        User->>API: POST /session/purge?session_id=...
        API->>RAM: del _sessions[session_id]
        RAM->>GC: Memory reclaimed immediately
        API-->>User: 200 OK (Purged)
    else Inactivity Timeout (Automatic TTL)
        Note over RAM,GC: 30 Minutes Inactivity Elapsed
        RAM->>GC: cleanup_expired_sessions() drops session from RAM
    end
```

### Privacy Guarantees
1. **No Accounts or Credentials:** No registration, email addresses, or password management required.
2. **Volatile RAM Only:** At no point during ingestion, parsing, or vector calculation are profiles saved to disk, relational databases, or cloud object stores (S3).
3. **Automated Eviction:** An automatic sliding window timer cleans up inactive sessions after 30 minutes of inactivity.
4. **GDPR Article 17 (Right to Erasure):** A user can invoke `POST /session/purge` at any time to instantly remove all vectors and tabular data from server memory.

---

## 3. Mathematical Scoring Model

Recommendations are ordered by a **hybrid composite function** balancing dense semantic vector proximity with deterministic decision-making authority:

$$\text{Final Score} = \left( w_s \times \text{CosineSimilarity}(\vec{q}, \vec{c}_i) \right) + \left( w_a \times \text{AuthorityWeight}(c_i) \right)$$

Where:
* $\vec{q} \in \mathbb{R}^{384}$: L2-normalized embedding of the user's pitch query.
* $\vec{c}_i \in \mathbb{R}^{384}$: L2-normalized embedding of connection profile document $i$ ($\text{Title} + \text{" at "} + \text{Company}$).
* $w_s$: Semantic match weight (default: $0.60$).
* $w_a$: Seniority authority weight (default: $0.40$).
* $w_s + w_a = 1.0$ (normalized dynamically if customized via UI sliders).

### Seniority Heuristics & Tier Classifications

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'darkMode': true,
    'background': '#0b0f19',
    'primaryColor': '#1e293b',
    'primaryTextColor': '#f8fafc',
    'primaryBorderColor': '#6366f1',
    'lineColor': '#818cf8'
  }
}}%%
graph LR
    subgraph Tiers ["Decision-Maker Authority Tiers"]
        T1["Tier 1: Weight 1.0<br><b>Direct Decision Makers</b><br>Founder, Co-Founder, CTO, VP, Head of, Recruiter, Talent"]
        T2["Tier 2: Weight 0.7<br><b>Engineering Leads</b><br>Director, Engineering Manager, Tech Lead, Architect"]
        T3["Tier 3: Weight 0.4<br><b>Senior Peer Referrals</b><br>Senior, Staff, Principal Engineers"]
        T4["Tier 4: Weight 0.1<br><b>Team Members</b><br>Standard individual contributors / General roles"]
    end
```

---

## 4. Cloud Deployment Architecture (AWS)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'darkMode': true,
    'background': '#0b0f19',
    'primaryColor': '#1e293b',
    'primaryTextColor': '#f8fafc',
    'primaryBorderColor': '#6366f1',
    'lineColor': '#818cf8'
  }
}}%%
flowchart LR
    subgraph Client ["Client Browser"]
        BROWSER["Web Browser"]
    end

    subgraph AWSCloud ["Amazon Web Services (AWS)"]
        subgraph StaticFrontend ["Frontend Hosting"]
            CF["Amazon CloudFront CDN"]
            S3["Amazon S3 Bucket / Amplify<br>(Compiled React SPA dist/)"]
        end

        subgraph ContainerCompute ["Backend Compute"]
            ECR["Amazon ECR<br>(Container Registry)"]
            APPRUNNER["AWS App Runner<br>(FastAPI Container Instance)"]
        end
    end

    BROWSER -->|HTTPS GET Static UI| CF
    CF --> S3
    BROWSER -->|HTTPS API Requests /recommend| APPRUNNER
    ECR -->|Deploy Image| APPRUNNER
```

### Component Roles:
* **Frontend:** Static SPA build (`dist/`) hosted on Amazon S3 and distributed globally via Amazon CloudFront (or Vercel / Cloudflare Pages) for sub-50ms latency.
* **Backend:** Single containerized service deployed to **AWS App Runner** using the optimized CPU PyTorch `Dockerfile`.
