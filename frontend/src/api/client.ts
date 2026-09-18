import type { CompanyIntroduction, RecommendationResponse } from '../types';

import { DEMO_RECOMMENDATION } from '../data/sampleData';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const UPLOAD_TIMEOUT_MS = 120_000; // backend zpracování běžně trvá 25-60s, dáváme rezervu

export interface HealthResponse {
  available: boolean;
  model?: string;
  error?: string;
}

// Backend posílá u Gemini chyb anglické/technické `detail` texty.
// Přemapujeme je na srozumitelné české hlášky podle HTTP statusu.
function friendlyErrorMessage(status: number, rawDetail: unknown): string {
  if (status === 429) return 'Služba je momentálně vytížená. Zkuste to prosím za chvíli znovu.';
  if (status === 403) return 'Služba je dočasně nedostupná kvůli problému s konfigurací. Kontaktujte prosím podporu.';
  if (status === 503) return 'Analytická služba je dočasně nedostupná. Zkuste to prosím za chvíli znovu.';
  if (status === 502) return 'Nepodařilo se zpracovat odpověď z AI služby. Zkuste to prosím znovu.';

  // Validační chyby (400) posílá backend rovnou česky ve stringu - použijeme je.
  if (typeof rawDetail === 'string' && rawDetail.trim()) return rawDetail;

  // FastAPI/Pydantic 422 vrací detail jako pole objektů, ne string.
  if (Array.isArray(rawDetail)) {
    const messages = rawDetail
      .map((item) => (item && typeof item === 'object' && 'msg' in item ? String((item as { msg: unknown }).msg) : null))
      .filter((msg): msg is string => !!msg);
    if (messages.length) return messages.join(', ');
  }

  return `Chyba serveru (${status})`;
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}/v1/upload-cvs?detailed=true`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      let rawDetail: unknown = null;
      try {
        const errorJson = await res.json();
        rawDetail = errorJson?.detail ?? null;
      } catch {
        // use fallback text
      }
      throw new Error(friendlyErrorMessage(res.status, rawDetail));
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
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Zpracování trvá déle než obvykle. Zkuste to prosím znovu za chvíli.');
    }
    // Prohlížeč vyhodí generický TypeError "Failed to fetch"/"NetworkError" při
    // výpadku sítě, nedostupném backendu nebo CORS chybě - text sám o sobě
    // uživateli nic neřekne, tak ho nahradíme konkrétnější hláškou.
    if (err instanceof TypeError) {
      throw new Error(
        'Nepodařilo se spojit se serverem. Zkontrolujte prosím internetové připojení a ověřte, že backend běží.'
      );
    }
    const message = err instanceof Error ? err.message : 'Neznámá chyba při komunikaci s backendem';
    throw new Error(message);
  } finally {
    clearTimeout(timeoutId);
  }
}

