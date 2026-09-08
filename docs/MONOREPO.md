# Monorepo Strategy & Turborepo Reference

This repository is organized as a **polyglot monorepo** managed by **Turborepo** and **pnpm workspaces**.

---

## 1. Workspace Structure

```plaintext
linkedin-cold-dm-recommender/
├── apps/
│   ├── api/                           # FastAPI + PyTorch Backend (@linkedin-recommender/api)
│   │   ├── src/
│   │   │   ├── core/                  # Configuration & In-Memory Session Manager
│   │   │   ├── models/                # Pydantic Schemas
│   │   │   ├── services/              # ML Embeddings, Heuristics, & Ranking
│   │   │   └── routers/               # APIRoutes (/health, /upload, /recommend)
│   │   ├── data/                      # Demo dataset
│   │   ├── tests/                     # Pytest suite
│   │   ├── Dockerfile                 # AWS App Runner production container
│   │   └── package.json               # Turborepo integration wrapper
│   │
│   └── web/                           # React 19 + Vite Frontend (@linkedin-recommender/web)
│       ├── src/
│       │   ├── components/            # UI components (Header, PitchBar, Sliders, Cards, Modals)
│       │   ├── services/              # Typed API client
│       │   └── types/                 # TypeScript interfaces
│       ├── tests/                     # Vitest test suite
│       ├── Dockerfile                 # Nginx multi-stage container
│       └── package.json
│
├── docs/                              # Architecture, Contributing, API specs
├── pnpm-workspace.yaml                # pnpm workspace definition
├── turbo.json                         # Turborepo pipeline configuration
├── Makefile                           # Polyglot CLI developer shortcuts
├── docker-compose.yml                 # Multi-container local orchestration
└── package.json                       # Monorepo root package
```

---

## 2. Why Turborepo + pnpm Workspaces?

1. **Polyglot Execution:** Python and Node run side-by-side cleanly. Turborepo orchestrates commands across both virtual environments and npm packages.
2. **Unified Single-Command Dev:** `pnpm dev` launches the FastAPI backend and Vite frontend concurrently with prefixed, color-coded terminal streams.
3. **Zero-Overhead Caching:** Outputs of builds, tests, and linting tasks are cached locally using content hashes, skipping unchanged workspaces.
4. **Fast Package Linking:** pnpm uses content-addressable storage and hard links to minimize disk consumption and install times.

---

## 3. Common Pipeline Commands

### Development
```bash
# Start both API and Web concurrently in hot-reload mode
pnpm dev
# OR using make
make dev
```

### Building
```bash
# Build all workspaces
pnpm build
# OR using make
make build
```

### Testing
```bash
# Run both backend (pytest) and frontend (vitest) tests
pnpm test

# Run backend tests only
pnpm test:api
# OR: make test-api

# Run frontend tests only
pnpm test:web
# OR: make test-web
```

### Filtering Tasks
Turborepo supports granular workspace selection using `--filter`:
```bash
# Run tests only in apps/web
pnpm turbo test --filter @linkedin-recommender/web

# Build only apps/api
pnpm turbo build --filter @linkedin-recommender/api
```

---

## 4. Pipeline Task Definitions (`turbo.json`)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "@linkedin-recommender/api#build": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "cache": false
    },
    "lint": {},
    "typecheck": {}
  }
}
```

---

## 5. Adding New Apps or Packages

To add a new application or shared library:
1. Create a directory under `apps/` or `packages/` (e.g. `packages/shared-types`).
2. Add a `package.json` with a unique name (e.g. `@linkedin-recommender/shared-types`).
3. Run `pnpm install` from the root to register the workspace in the pnpm lockfile.
