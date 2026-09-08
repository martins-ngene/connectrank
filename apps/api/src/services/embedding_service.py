from typing import List, Optional
# pyrefly: ignore [missing-import]
import numpy as np
# pyrefly: ignore [missing-import]
from sentence_transformers import SentenceTransformer
from src.core.config import settings

class EmbeddingService:
    """
    Singleton service wrapper around SentenceTransformer.
    Ensures model weights are loaded once in memory and handles batched vector encoding.
    """
    def __init__(self, model_name: str = settings.model_name):
        self.model_name = model_name
        self._model: Optional[SentenceTransformer] = None

    def load_model(self) -> None:
        """Load SentenceTransformer model into memory."""
        if self._model is None:
            print(f"[EmbeddingService] Loading model '{self.model_name}'...")
            self._model = SentenceTransformer(self.model_name)
            print("[EmbeddingService] Model loaded successfully.")

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def encode_documents(self, documents: List[str], batch_size: int = 64) -> np.ndarray:
        """Encodes connection profile documents with L2 normalization for cosine similarity."""
        if self._model is None:
            self.load_model()
        assert self._model is not None, "SentenceTransformer model failed to initialize"
        return self._model.encode(
            documents,
            batch_size=batch_size,
            normalize_embeddings=True,
            show_progress_bar=False
        )

    def encode_query(self, query: str) -> np.ndarray:
        """Encodes a single user pitch query with L2 normalization."""
        if self._model is None:
            self.load_model()
        assert self._model is not None, "SentenceTransformer model failed to initialize"
        return self._model.encode([query], normalize_embeddings=True)

# Global embedding service singleton
embedding_service = EmbeddingService()
