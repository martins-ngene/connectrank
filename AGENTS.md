# Workspace Guidelines & Agent Instructions

## 1. Documentation & Resume Maintenance (Mandatory)
- **Always update [`RESUME.md`](file:///Users/martinium-dev/projects/aws-projects/linkedin-cold-dm-recommender/RESUME.md)**:
  - Whenever a new feature, bug fix, performance optimization, or UX enhancement is implemented, record it in `RESUME.md`.
  - Maintain the **Work Experience Bullets** framework: `[Action Verb] + [Quantified Outcome/Impact] + [What You Did] + [Method/Process/Tools]`.
  - Update the **Engineering Log**: Document the exact user prompt, root cause, thought process, code solution, and provide a simple Mermaid sequence or architecture diagram where appropriate.
- **Synchronize Project Documentation**:
  - Keep [`docs/API.md`](file:///Users/martinium-dev/projects/aws-projects/linkedin-cold-dm-recommender/docs/API.md) up-to-date whenever FastAPI endpoints, parameters, or schemas change.
  - Keep [`README.md`](file:///Users/martinium-dev/projects/aws-projects/linkedin-cold-dm-recommender/README.md) aligned with the active architecture, setup commands, and feature set.

## 2. Privacy & Zero-Persistence Invariant
- Never commit or persist raw user CSV exports, parquets, or PII to the repository or disk.
- Ensure all test suites (`pytest` and `vitest`) continue passing at 100% across the monorepo (`pnpm turbo test`).
