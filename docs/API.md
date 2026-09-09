# API Reference & OpenAPI Specification

[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1-6BA539.svg?style=flat-square&logo=openapi-initiative&logoColor=white)](http://localhost:8080/openapi.json)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2.6+-E92063.svg?style=flat-square&logo=pydantic&logoColor=white)](https://docs.pydantic.dev)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB.svg?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Sentry](https://img.shields.io/badge/Sentry-APM_Tracing-362D59.svg?style=flat-square&logo=sentry&logoColor=white)](https://sentry.io)
[![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D.svg?style=flat-square&logo=swagger&logoColor=black)](http://localhost:8080/docs)

The ConnectRank backend provides an OpenAPI 3.1 compliant REST interface built with FastAPI, Pydantic v2, and PyTorch.

* **Interactive Swagger UI:** `http://localhost:8080/docs`
* **Interactive ReDoc:** `http://localhost:8080/redoc`
* **Raw OpenAPI JSON Schema:** `http://localhost:8080/openapi.json`

### Backend Technology Specifications

| Component | Technology | Specification / Notes |
| :--- | :--- | :--- |
| **Framework** | [FastAPI](https://fastapi.tiangolo.com) | Async ASGI router, dependency injection, lifespan context manager |
| **Data Validation** | [Pydantic v2](https://docs.pydantic.dev) | High-speed Rust-based serialization and strict request/response validation |
| **File Ingestion** | `python-multipart` | Streaming multipart CSV uploads handled directly in volatile RAM |
| **Telemetry** | `sentry-sdk` | Starlette and FastAPI middleware integration with automated PII scrubbing |

---

## Endpoints Overview

| Method | Endpoint | Description | Auth / State |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | System health, indexed profile count, and privacy status | Public |
| `POST` | `/upload` | Upload `Connections.csv` directly into volatile RAM | Ephemeral Session |
| `POST` | `/recommend` | Calculate ranked recommendations based on pitch | Demo or Session |
| `GET` | `/session/{session_id}` | Check active session TTL and indexed count | Ephemeral Session |
| `POST` | `/session/purge` | Instantly wipe user session from RAM (GDPR Art. 17) | Ephemeral Session |

---

## 1. System Health (`GET /health`)

Returns server status, model information, number of preloaded demo profiles, and active ephemeral in-memory sessions count.

### Request Example
```bash
curl -X GET http://localhost:8080/health
```

### Response Example (`200 OK`)
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "demo_profiles_indexed": 500,
  "active_ephemeral_sessions": 1,
  "privacy_guarantee": "Zero-persistence. User PII is processed strictly in RAM and automatically purged."
}
```

---

## 2. Ingest LinkedIn CSV (`POST /upload`)

Uploads a LinkedIn export `Connections.csv` file directly into server RAM. Encodes profile documents on the fly and returns an ephemeral `session_id`.

> [!IMPORTANT]
> Strict Zero-Persistence Guarantee: No uploaded files are ever saved to disk or persistent databases.

### Request Parameters
* Content-Type: `multipart/form-data`
* `file`: Binary CSV file payload.

### Request Example
```bash
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/Connections.csv"
```

### Response Example (`201 Created`)
```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "profiles_indexed": 2140,
  "seconds_until_expiry": 1800,
  "message": "Successfully indexed 2140 connections in ephemeral memory.",
  "privacy_notice": "Zero-persistence guarantee: Your uploaded connections are held only in RAM and will be purged automatically after 30 minutes of inactivity or when you click 'Purge My Data'. No files were written to disk."
}
```

---

## 3. Recommend Candidates (`POST /recommend`)

Computes dense cosine similarity between the user pitch query and the connection vectors, augmented by deterministic seniority authority weights.

$$\text{Final Score} = w_s \times \text{CosineSimilarity}(\vec{q}, \vec{c}_i) + w_a \times \text{Authority}(c_i)$$

### Query / Body Parameters

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `pitch` | `string` | *(Required)* | Target role or skill description (e.g. `Senior Backend Engineer Python AWS`). |
| `top_k` | `integer` | `15` | Number of top candidates to return (1 to 100). |
| `semantic_weight` | `float` | `0.6` | Weight of dense semantic similarity ($0.0 \le w_s \le 1.0$). |
| `authority_weight`| `float` | `0.4` | Weight of authority heuristic ($0.0 \le w_a \le 1.0$). |
| `session_id` | `string` | `null` | Ephemeral session token from `/upload`. If omitted, searches preloaded demo dataset. |
| `min_authority` | `float` | `null` | Minimum authority threshold filter (`0.4`, `0.7`, `1.0`). |
| `remote_only` | `boolean` | `false` | When true, filters for connections in companies hiring for remote, anywhere, worldwide, or global roles. |

### Request Example (cURL)
```bash
curl -X POST "http://localhost:8080/recommend?pitch=Senior+Backend+Engineer+Python+AWS&top_k=5&remote_only=true" \
  -H "Content-Type: application/json"
```

### Request Example (JSON Body)
```bash
curl -X POST "http://localhost:8080/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "pitch": "Founding Engineer Distributed Systems",
    "top_k": 3,
    "semantic_weight": 0.7,
    "authority_weight": 0.3,
    "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "remote_only": true
  }'
```

### Response Example (`200 OK`)
```json
[
  {
    "name": "Sarah Connor",
    "position": "Chief Technology Officer",
    "company": "GitLab",
    "url": "https://www.linkedin.com/in/sarah-connor",
    "score": 89.2,
    "semantic_match_pct": 84.1,
    "authority_weight": 1.0,
    "seniority_tier": "Direct Decision Maker",
    "reason": "Semantic Relevance: 84.1% (70% weight) | Authority: 1.0 (Direct Decision Maker, 30% weight) | Remote-First Organization",
    "is_remote_friendly": true,
    "remote_label": "Remote-First Organization"
  },
  {
    "name": "David Bowman",
    "position": "Director of Infrastructure Engineering",
    "company": "Discovery Aerospace",
    "url": "https://www.linkedin.com/in/david-bowman",
    "score": 78.5,
    "semantic_match_pct": 79.2,
    "authority_weight": 0.7,
    "seniority_tier": "Engineering Lead",
    "reason": "Semantic Relevance: 79.2% (70% weight) | Authority: 0.7 (Engineering Lead, 30% weight)",
    "is_remote_friendly": false,
    "remote_label": null
  }
]
```

---

## 4. Session Status (`GET /session/{session_id}`)

Checks if an ephemeral session is currently active in memory and retrieves the remaining seconds until automatic TTL eviction.

### Request Example
```bash
curl -X GET http://localhost:8080/session/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

### Response Example (`200 OK`)
```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "total_profiles": 2140,
  "seconds_until_expiry": 1645,
  "is_ephemeral": true
}
```

---

## 5. Purge Session (`POST /session/purge`)

Fulfills **GDPR Article 17 (Right to Erasure)** by immediately deleting all vectors and connection data from server RAM.

### Request Example
```bash
curl -X POST "http://localhost:8080/session/purge?session_id=3fa85f64-5717-4562-b3fc-2c963f66afa6"
```

### Response Example (`200 OK`)
```json
{
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "purged": true,
  "message": "Session and all associated connection profiles were successfully purged from server memory."
}
```

---

## 6. Client Code Examples

### TypeScript / Fetch
```typescript
import { Candidate } from './types';

export async function getRecommendations(pitch: string, sessionId?: string): Promise<Candidate[]> {
  const url = new URL('http://localhost:8080/recommend');
  url.searchParams.set('pitch', pitch);
  if (sessionId) url.searchParams.set('session_id', sessionId);

  const res = await fetch(url.toString(), { method: 'POST' });
  if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
  return res.json();
}
```

### Python / Requests
```python
import requests

def search_network(pitch: str, session_id: str = None):
    url = "http://localhost:8080/recommend"
    params = {"pitch": pitch, "top_k": 10}
    if session_id:
        params["session_id"] = session_id
        
    response = requests.post(url, params=params)
    response.raise_for_status()
    return response.json()
```
