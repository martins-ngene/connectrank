# System Architecture & Technical Specification

[![Architecture](https://img.shields.io/badge/Architecture-C4_Model-blueviolet.svg?style=flat-square)](docs/ARCHITECTURE.md)
[![Backend](https://img.shields.io/badge/Backend-FastAPI_+_Python_3.13-009688.svg?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![ML](https://img.shields.io/badge/ML_Engine-PyTorch_+_Sentence--Transformers-FFD21E.svg?style=flat-square&logo=pytorch&logoColor=white)](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
[![Frontend](https://img.shields.io/badge/Frontend-React_19_+_TypeScript-61DAFB.svg?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Privacy](https://img.shields.io/badge/Privacy-GDPR_Art._17_Zero--Persistence-10B981.svg?style=flat-square)](docs/ARCHITECTURE.md)
[![Observability](https://img.shields.io/badge/Observability-Sentry_APM-362D59.svg?style=flat-square&logo=sentry&logoColor=white)](https://sentry.io)
[![Cloud](https://img.shields.io/badge/Cloud-AWS_App_Runner_+_S3-FF9900.svg?style=flat-square&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)

This document provides a comprehensive technical overview of **ConnectRank**, covering system design, ephemeral memory management, the composite scoring model, and cloud deployment topology.

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

## 4. Cloud Deployment Architecture (Cloudflare Pages + AWS App Runner)

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
    subgraph Client ["Client Layer"]
        BROWSER["Web Browser"]
    end

    subgraph CloudflareCloud ["Cloudflare Edge ($0.00/mo)"]
        CF_PAGES["Cloudflare Pages CDN<br>(Compiled React SPA dist/)<br>• Zero Egress Bandwidth Fees<br>• SPA Fallback (_redirects -> 200)"]
    end

    subgraph AWSCloud ["Amazon Web Services (AWS ~$11.22/mo)"]
        subgraph ContainerCompute ["Backend Compute"]
            ECR["Amazon ECR<br>(connectrank-api:latest)"]
            APPRUNNER["AWS App Runner<br>(1 vCPU / 2GB RAM Container)<br>• Port 8080 | Health: /health"]
        end

        subgraph Guardrails ["Cost Guardrails"]
            BUDGETS["AWS Budgets ($15/mo Cap)"]
            ALARMS["CloudWatch Billing Alarms"]
        end
    end

    BROWSER -->|HTTPS GET Static UI (Edge CDN)| CF_PAGES
    BROWSER -->|HTTPS API POST /recommend| APPRUNNER
    ECR -->|Deploy Image| APPRUNNER
    APPRUNNER -.-> Guardrails
```

### Component Roles:
* **Frontend:** Static SPA build (`dist/`) hosted on **Cloudflare Pages** for zero-cost, sub-50ms edge delivery with unlimited requests and zero egress bandwidth fees.
* **Backend:** Serverless container service deployed to **AWS App Runner** (1 vCPU / 2 GB RAM) using the optimized CPU PyTorch `Dockerfile`, capped to a $100 / 6-month budget.
* **Deployment Guide:** Complete step-by-step checklist, cost breakdown, and billing alarms are documented in [**docs/DEPLOYMENT.md**](DEPLOYMENT.md).

---

## 5. Technology Stack Mapping by Architectural Layer

| Architectural Tier | Primary Technologies | Badges | Architecture Responsibilities |
| :--- | :--- | :--- | :--- |
| **Presentation Tier** (`apps/web`) | React 19, TypeScript, Vite, Tailwind CSS v4, Radix UI | [![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat-square&logo=react&logoColor=black)](https://react.dev) [![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![TypeScript](https://img.shields.io/badge/TS-5.x-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org) | Renders responsive SPA interface, manages dynamic client weighting state, enforces accessible WAI-ARIA dialogs, handles persistent dual-theme switching. |
| **Application & API Gateway** (`apps/api`) | FastAPI, Python 3.13, Pydantic v2, Uvicorn | [![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com) [![Pydantic](https://img.shields.io/badge/Pydantic-v2-E92063.svg?style=flat-square&logo=pydantic&logoColor=white)](https://pydantic.dev) | Enforces strict OpenAPI schema contracts, executes async request lifecycle, parses multipart CSV uploads, validates pitch search requests. |
| **Machine Learning & Inference** | PyTorch (CPU), SentenceTransformers, NumPy | [![PyTorch](https://img.shields.io/badge/PyTorch-CPU-EE4C2C.svg?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org) [![HF](https://img.shields.io/badge/HuggingFace-MiniLM-FFD21E.svg?style=flat-square&logo=huggingface&logoColor=black)](https://huggingface.co) | Computes 384-dimensional dense semantic vectors using `all-MiniLM-L6-v2`, runs vectorized cosine similarity matrix dot products. |
| **Zero-Persistence Data Layer** | In-Memory Session Cache (`SessionManager`) | [![GDPR](https://img.shields.io/badge/GDPR-Art._17-10B981.svg?style=flat-square)](docs/ARCHITECTURE.md) | Ephemeral RAM storage, automatic 30-minute rolling TTL inactivity eviction, single-click instant purge endpoint; zero disk I/O. |
| **Observability & APM** | Sentry SDK (FastAPI + React), Error Boundaries | [![Sentry](https://img.shields.io/badge/Sentry-APM-362D59.svg?style=flat-square&logo=sentry&logoColor=white)](https://sentry.io) | Real-time fullstack exception tracing, React glassmorphic crash boundary fallback, and automated GDPR PII scrubbing before payload transmission. |
| **Monorepo & Build System** | Turborepo, pnpm Workspaces | [![Turborepo](https://img.shields.io/badge/Turborepo-2.x-EF4444.svg?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build) [![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220.svg?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io) | Polyglot pipeline orchestrator running parallel TypeScript and Python test/build tasks with content-hash artifact caching. |
| **Cloud & Deployment** | Cloudflare Pages, AWS App Runner, Docker | [![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020.svg?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com) [![AWS](https://img.shields.io/badge/AWS-App_Runner-FF9900.svg?style=flat-square&logo=amazon-aws&logoColor=white)](https://aws.amazon.com) | Multi-stage containerization, serverless autoscaling backend compute, zero-cost edge static frontend hosting ($0 egress). |

