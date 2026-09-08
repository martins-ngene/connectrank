export interface Candidate {
  name: string;
  position: string;
  company: string;
  url: string;
  score: number;
  semantic_match_pct: number;
  authority_weight: number;
  seniority_tier: string;
  reason: string;
  is_remote_friendly?: boolean;
  remote_label?: string | null;
}

export interface RecommendationParams {
  pitch: string;
  top_k?: number;
  semantic_weight?: number;
  authority_weight?: number;
  session_id?: string | null;
  min_authority?: number;
  remote_only?: boolean;
}

export interface UploadResponse {
  session_id: string;
  profiles_indexed: number;
  seconds_until_expiry: number;
  message: string;
  privacy_notice: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  demo_profiles_indexed: number;
  active_ephemeral_sessions: number;
  privacy_guarantee: string;
}

export interface PurgeResponse {
  session_id: string;
  purged: boolean;
  message: string;
}

export interface DMTemplate {
  id: string;
  name: string;
  description: string;
  generateText: (candidate: Candidate, pitch: string) => string;
}
