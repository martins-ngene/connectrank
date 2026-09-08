.PHONY: setup dev build test test-api test-web lint typecheck docker-up docker-down clean help

PYTHON ?= ./venv/bin/python

help:
	@echo "ConnectRank Monorepo"
	@echo "======================================"
	@echo "make setup      - Install Node and Python dependencies"
	@echo "make dev        - Run both API and Web in development mode"
	@echo "make build      - Build all packages"
	@echo "make test       - Run all backend and frontend tests"
	@echo "make test-api   - Run backend tests only"
	@echo "make test-web   - Run frontend tests only"
	@echo "make lint       - Lint all workspaces"
	@echo "make typecheck  - Typecheck all workspaces"
	@echo "make docker-up  - Run docker-compose cluster (API + Web)"
	@echo "make docker-down- Stop docker-compose cluster"
	@echo "make clean      - Clean cache and build artifacts"

setup:
	pnpm install
	$(PYTHON) -m pip install -r apps/api/requirements.txt
	$(PYTHON) -m pip install -r apps/api/requirements-dev.txt

dev:
	pnpm dev

build:
	pnpm build

test:
	pnpm test

test-api:
	pnpm test:api

test-web:
	pnpm test:web

lint:
	pnpm lint

typecheck:
	pnpm typecheck

docker-up:
	docker compose up --build

docker-down:
	docker compose down

clean:
	pnpm clean
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
