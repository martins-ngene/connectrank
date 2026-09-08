# Contributing Guidelines

Thank you for contributing to the **LinkedIn Cold DM Recommender** project. Follow these guidelines to maintain high architectural quality, safety, and privacy compliance.

---

## 1. Prerequisites

Ensure the following runtimes are installed on your workstation:
* **Node.js:** v20.x or higher (`node -v`)
* **pnpm:** v10.x or higher (`pnpm -v`)
* **Python:** 3.11+ (`python3 --version`)
* **Docker:** (Optional, for containerized integration testing)

---

## 2. Quick Setup

```bash
# Clone the repository
git clone <repository-url>
cd linkedin-cold-dm-recommender

# Initialize virtual environment and install all dependencies
make setup
```

Alternatively, manually:
```bash
# Install Node dependencies
pnpm install

# Setup Python virtualenv and packages
python3 -m venv venv
./venv/bin/pip install -r apps/api/requirements.txt
./venv/bin/pip install -r apps/api/requirements-dev.txt
```

---

## 3. Development Workflow

Start both applications in local development mode:
```bash
make dev
# OR: pnpm dev
```
* **Frontend Web App:** `http://localhost:5173`
* **Backend API Docs (Swagger):** `http://localhost:8080/docs`
* **ReDoc API Spec:** `http://localhost:8080/redoc`

---

## 4. Testing Standards

Every feature or refactor must be accompanied by automated tests.

### Running Backend Tests (`pytest`)
```bash
make test-api
# OR: ./venv/bin/python -m pytest apps/api/tests -v
```

### Running Frontend Tests (`vitest`)
```bash
make test-web
# OR: pnpm --filter @linkedin-recommender/web test
```

### Running the Full Monorepo Pipeline
```bash
make test
# OR: pnpm test
```

---

## 5. Privacy & GDPR Compliance Rules

When modifying backend or data processing code:
* **Zero Persistence:** NEVER write raw CSV contents or parsed connection profiles to files, SQLite databases, or external third-party storage.
* **In-Memory Encapsulation:** Store user data strictly inside `SessionManager` in RAM.
* **Right to Erasure:** Ensure any new profile fields or vector indices are safely discarded when `session_manager.purge_session(session_id)` is invoked.

---

## 6. Conventional Commit Messages

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:
* `feat:` A new feature (e.g. `feat(web): add export to CSV button`)
* `fix:` A bug fix (e.g. `fix(api): handle missing URL fields in CSV upload`)
* `docs:` Documentation updates (e.g. `docs(api): document session TTL parameters`)
* `refactor:` Code refactoring without behavioral changes
* `test:` Adding or updating tests
* `chore:` Build scripts or dependency updates

---

## 7. Pull Request Checklist

Before opening a Pull Request:
1. `pnpm typecheck` passes without errors.
2. `make test` passes 100% of backend and frontend tests.
3. Code changes do not violate zero-persistence GDPR principles.
4. Relevant documentation in `docs/` is updated.
