import { Candidate, RecommendationParams, UploadResponse, HealthResponse, PurgeResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) {
    throw new Error(`Failed to fetch health status (${res.status})`);
  }
  return res.json();
}

export async function fetchRecommendations(params: RecommendationParams): Promise<Candidate[]> {
  const url = new URL(`${API_BASE_URL}/recommend`);
  url.searchParams.set('pitch', params.pitch);
  if (params.top_k) url.searchParams.set('top_k', params.top_k.toString());
  if (params.semantic_weight !== undefined) url.searchParams.set('semantic_weight', params.semantic_weight.toString());
  if (params.authority_weight !== undefined) url.searchParams.set('authority_weight', params.authority_weight.toString());
  if (params.session_id) url.searchParams.set('session_id', params.session_id);
  if (params.min_authority !== undefined) url.searchParams.set('min_authority', params.min_authority.toString());
  if (params.remote_only !== undefined) url.searchParams.set('remote_only', params.remote_only.toString());

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export async function uploadConnectionsCSV(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed with status ${res.status}`);
  }

  return res.json();
}

export async function purgeSessionData(sessionId: string): Promise<PurgeResponse> {
  const res = await fetch(`${API_BASE_URL}/session/purge?session_id=${encodeURIComponent(sessionId)}`, {
    method: 'POST',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Purge failed with status ${res.status}`);
  }

  return res.json();
}
