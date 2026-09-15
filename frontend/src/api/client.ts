import type { CompanyIntroduction, RecommendationResponse } from '../types';

import { DEMO_RECOMMENDATION } from '../data/sampleData';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export interface HealthResponse {
  available: boolean;
  model?: string;
  error?: string;
}

export async function checkBackendHealth(): Promise<HealthResponse> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${BASE_URL}/v1/health`, {
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!res.ok) {
      return { available: false, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return {
      available: !!data.available,
      model: data.model || 'gemini',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Backend offline';
    return { available: false, error: message };
  }
}

export async function submitCandidateEvaluation(
  company: CompanyIntroduction,
  jobAd: string,
  files: File[],
  isDemoMode: boolean = false
): Promise<RecommendationResponse> {
  if (isDemoMode) {
    // Simulate real pipeline latency (approx 2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2500));
    return DEMO_RECOMMENDATION;
  }

  if (files.length !== 2) {
    throw new Error('Pro porovnání je nutné nahrát přesně 2 CV soubory ve formátu PDF.');
  }

  const formData = new FormData();
  formData.append('company_introduction', JSON.stringify(company));
  formData.append('job_ad', jobAd);
  formData.append('files', files[0]);
  formData.append('files', files[1]);

  try {
    const res = await fetch(`${BASE_URL}/v1/upload-cvs?detailed=true`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      let detail = `Chyba serveru (${res.status})`;
      try {
        const errorJson = await res.json();
        detail = errorJson.detail || detail;
      } catch {
        // use fallback text
      }
      throw new Error(detail);
    }

    const data: RecommendationResponse = await res.json();

    // If backend returned only basic fields without full candidate details, fill with sensible display names
    if (!data.extracted_candidates || data.extracted_candidates.length === 0) {
      data.extracted_candidates = [
        { candidate_name: files[0]?.name.replace(/\.pdf$/i, '') || 'Kandidát 1' },
        { candidate_name: files[1]?.name.replace(/\.pdf$/i, '') || 'Kandidát 2' },
      ];
    }

    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Neznámá chyba při komunikaci s backendem';
    throw new Error(message);
  }
}

