FROM python:3.11-slim

WORKDIR /app

# Prevent pip timeouts on slow connections
RUN pip install --no-cache-dir --upgrade pip && \
    pip config set global.timeout 1000

COPY requirements.txt .

# 1. Install lightweight CPU PyTorch wheel directly (~150MB instead of heavy CUDA binaries)
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# 2. Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 3. Pre-cache Hugging Face model weights in container image layer for fast cold starts
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')"

# 4. Create ephemeral data directory and copy application source
RUN mkdir -p data
COPY src/ ./src/

ENV PORT=8080
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
