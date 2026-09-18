import type { CompanyIntroduction, RecommendationResponse } from '../types';

import { DEMO_RECOMMENDATION } from '../data/sampleData';

const BASE_URL = 'https://enterprisebotbackend.onrender.com';
const UPLOAD_TIMEOUT_MS = 120_000; // backend zpracování běžně trvá 25-60s, dáváme rezervu

export interface HealthResponse {
  available: boolean;
  model?: string;
  error?: string;
}

// Backend posílá u Gemini chyb anglické/technické `detail` texty.
// Přemapujeme je na srozumitelné české hlášky podle HTTP statusu a kontextu.
function friendlyErrorMessage(status: number, rawDetail: unknown, targetUrl?: string): string {
  if (status === 429) {
    return 'Limit požadavků byl vyčerpán (HTTP 429). Bezplatný limit Gemini API je momentálně přetížený. Zkuste to prosím za 1–2 minuty znovu.';
  }
  if (status === 403) {
    return 'Přístup byl odepřen (HTTP 403). Služba je nedostupná kvůli konfiguraci serveru nebo neplatnému API klíči.';
  }
  if (status === 404) {
    return `Endpoint nebyl nalezen (HTTP 404 na ${targetUrl || 'API'}). Zkontrolujte, zda je na Renderu správně nastavena Environment Variable VITE_API_URL.`;
  }
  if (status === 502) {
    return 'Server desideo je dočasně nedostupný (HTTP 502 Bad Gateway). Pokud backend běží na Render.com, bezplatná instance se po nečinnosti uspává a probuzení trvá 30–50 sekund. Zkuste to za chvíli znovu.';
  }
  if (status === 503) {
    return 'Analytická služba nebo AI model je dočasně nedostupný (HTTP 503 Service Unavailable). Vyčkejte prosím chvíli a zkuste to znovu.';
  }
  if (status === 504) {
    return 'Vypršel časový limit brány (HTTP 504 Gateway Timeout). AI analýza trvala déle, než povoluje limit serveru/proxy.';
  }

  // Validační chyby (400) posílá backend rovnou česky ve stringu - použijeme je.
  if (typeof rawDetail === 'string' && rawDetail.trim()) {
    if (/gemini|api_key|quota|resource_exhausted/i.test(rawDetail)) {
      return `Chyba AI modelu (Gemini): ${rawDetail}`;
    }
    return rawDetail;
  }

  // FastAPI/Pydantic 422 vrací detail jako pole objektů, ne string.
  if (Array.isArray(rawDetail)) {
    const messages = rawDetail
      .map((item) => (item && typeof item === 'object' && 'msg' in item ? String((item as { msg: unknown }).msg) : null))
      .filter((msg): msg is string => !!msg);
    if (messages.length) return `Chyba zadání: ${messages.join(', ')}`;
  }

  return `Chyba serveru (HTTP ${status})`;
}

export async function checkBackendHealth(): Promise<HealthResponse> {
  const healthUrl = `${BASE_URL}/v1/health`;
  console.log(
    '%c[desideo] 🔍 Ověřuji spojení s backendem...',
    'color: #6366f1; font-weight: bold;',
    `\nCílová URL: ${healthUrl.startsWith('http') ? healthUrl : window.location.origin + healthUrl}`
  );

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(healthUrl, {
      signal: controller.signal,
    });
    clearTimeout(id);

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    if (!res.ok) {
      console.error(
        '%c[desideo] ❌ Backend se NEPODAŘILO připojit (Chyba HTTP)',
        'color: #ef4444; font-weight: bold; font-size: 13px;',
        `\nStatus: HTTP ${res.status} (${res.statusText})`,
        `\nURL: ${healthUrl.startsWith('http') ? healthUrl : window.location.origin + healthUrl}`,
        `\nOdpověď:`, text.slice(0, 300)
      );
      return { available: false, error: `HTTP ${res.status}: ${res.statusText}` };
    }

    if (contentType.includes('text/html') || text.trim().startsWith('<')) {
      console.error(
        '%c[desideo] ❌ Backend se NEPODAŘILO připojit (Server vrátil HTML místo JSON)',
        'color: #ef4444; font-weight: bold; font-size: 13px;',
        `\nURL: ${healthUrl.startsWith('http') ? healthUrl : window.location.origin + healthUrl}`,
        `\nDůvod: Požadavek skončil na statickém webu místo na FastAPI backendu.`,
        `\nTip pro Render.com: V nastavení statického webu přidejte Environment Variable: VITE_API_URL=https://<váš-backend>.onrender.com`
      );
      return { available: false, error: 'Server vrátil HTML stránku místo JSON API' };
    }

    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      console.error(
        '%c[desideo] ❌ Backend odpověděl neplatným JSON',
        'color: #ef4444; font-weight: bold; font-size: 13px;',
        text
      );
      return { available: false, error: 'Neplatná odpověď serveru' };
    }

    console.log(
      '%c[desideo] ✅ Backend úspěšně připojen!',
      'color: #10b981; font-weight: bold; font-size: 13px;',
      `\nURL: ${healthUrl.startsWith('http') ? healthUrl : window.location.origin + healthUrl}`,
      `\nModel: ${data.model || 'gemini'}`,
      `\nStav:`, data
    );

    return {
      available: !!data.available,
      model: data.model || 'gemini',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Backend offline';
    console.error(
      '%c[desideo] ❌ Backend se NEPODAŘILO připojit (Výpadek spojení / offline)',
      'color: #ef4444; font-weight: bold; font-size: 13px;',
      `\nURL: ${healthUrl.startsWith('http') ? healthUrl : window.location.origin + healthUrl}`,
      `\nChyba: ${message}`,
      `\nTip: Pokud backend běží na Renderu, bezplatná instance se po nečinnosti uspává (studený start trvá 30–50 s). Pokud běžíte lokálně, spusťte start_backend.bat.`
    );
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
    console.log('%c[desideo] ℹ️ Spuštěn Demo režim (simulace s testovacími daty)', 'color: #8b5cf6; font-weight: bold;');
    // Simulate real pipeline latency (approx 2.2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2200));
    return DEMO_RECOMMENDATION;
  }

  if (files.length !== 2) {
    throw new Error('Pro porovnání je nutné nahrát přesně 2 CV soubory ve formátu PDF.');
  }

  const endpointUrl = `${BASE_URL}/v1/upload-cvs?detailed=true`;
  const resolvedUrl = endpointUrl.startsWith('http') ? endpointUrl : `${window.location.origin}${endpointUrl}`;

  console.log(
    '%c[desideo] 🚀 Odesílám 2 CV k AI analýze na backend...',
    'color: #3b82f6; font-weight: bold; font-size: 13px;',
    `\nCílová URL: ${resolvedUrl}`,
    `\nSoubory:`, files.map((f) => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`),
    `\nVITE_API_URL:`, BASE_URL || '(není nastavena, volá se relativní URL)'
  );

  const formData = new FormData();
  formData.append('company_introduction', JSON.stringify(company));
  formData.append('job_ad', jobAd);
  formData.append('files', files[0]);
  formData.append('files', files[1]);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(endpointUrl, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === 'AbortError') {
      const msg = `Časový limit pro vyhodnocení vypršel (${UPLOAD_TIMEOUT_MS / 1000} s). Server na ${resolvedUrl} neodpověděl včas. Pokud běží na Renderu, může se po nečinnosti probouzet.`;
      console.error('%c[desideo] ❌ Timeout:', 'color: #ef4444; font-weight: bold; font-size: 13px;', msg);
      throw new Error(msg);
    }

    if (err instanceof TypeError) {
      const msg =
        `Nepodařilo se navázat spojení se serverem na adrese: ${resolvedUrl}.\n` +
        (BASE_URL
          ? `Ověřte, zda backend na Renderu (${BASE_URL}) běží.`
          : `Proměnná VITE_API_URL není nastavena a lokální backend na ${window.location.origin} neodpovídá.`);
      console.error('%c[desideo] ❌ Výpadek sítě / CORS:', 'color: #ef4444; font-weight: bold; font-size: 13px;', msg, err);
      throw new Error(msg);
    }

    const rawMsg = err instanceof Error ? err.message : String(err);
    console.error('%c[desideo] ❌ Neznámá chyba sítě:', 'color: #ef4444; font-weight: bold; font-size: 13px;', rawMsg);
    throw new Error(`Chyba spojení se serverem: ${rawMsg}`);
  } finally {
    clearTimeout(timeoutId);
  }

  // Přečteme odpověď jako text bez rizika pádu na "Unexpected end of JSON input"
  const rawText = await res.text();
  const contentType = res.headers.get('content-type') || '';

  // 1. Ošetření chybových HTTP statusů (!res.ok)
  if (!res.ok) {
    console.error(
      '%c[desideo] ❌ Server vrátil chybový status:',
      'color: #ef4444; font-weight: bold; font-size: 13px;',
      `HTTP ${res.status} (${res.statusText})`,
      `\nCílová URL: ${resolvedUrl}`,
      `\nOdpověď:`, rawText || '(prázdná odpověď)'
    );

    // Pokud je tělo prázdné
    if (!rawText || !rawText.trim()) {
      throw new Error(friendlyErrorMessage(res.status, null, resolvedUrl));
    }

    // Pokud server poslal HTML stránku místo JSON (např. 404 nebo 502 ze statického hostingu)
    if (contentType.includes('text/html') || rawText.trim().startsWith('<')) {
      throw new Error(
        `Server na ${resolvedUrl} vrátil chybovou HTML stránku (HTTP ${res.status}). ` +
        `Požadavek neskončil na backendovém API. Ověřte nastavení VITE_API_URL na Renderu.`
      );
    }

    // Pokusíme se bezpečně parsovat JSON chybu z FastAPI
    try {
      const errorJson = JSON.parse(rawText);
      const detail = errorJson?.detail;
      throw new Error(friendlyErrorMessage(res.status, detail, resolvedUrl));
    } catch (parseErr) {
      if (parseErr instanceof Error && parseErr.message && !parseErr.message.includes('JSON')) {
        throw parseErr;
      }
      throw new Error(friendlyErrorMessage(res.status, rawText.slice(0, 200), resolvedUrl));
    }
  }

  // 2. res.ok je true (HTTP 200), ale zkontrolujeme, zda tělo není prázdné nebo HTML
  if (!rawText || !rawText.trim()) {
    console.error(
      '%c[desideo] ❌ Server vrátil HTTP 200, ale tělo odpovědi je zcela prázdné!',
      'color: #ef4444; font-weight: bold; font-size: 13px;',
      `URL: ${resolvedUrl}`
    );
    throw new Error(
      `Server vrátil stav HTTP 200 OK, ale odpověď byla prázdná (spojení bylo předčasně ukončeno nebo proxy neposlala tělo). Zkuste to prosím znovu.`
    );
  }

  if (contentType.includes('text/html') || rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html')) {
    console.error(
      '%c[desideo] ❌ Server vrátil HTTP 200 s HTML obsahem místo JSON!',
      'color: #ef4444; font-weight: bold; font-size: 13px;',
      `\nCílová URL: ${resolvedUrl}`,
      `\nUkázka odpovědi:`, rawText.slice(0, 300)
    );
    throw new Error(
      `Požadavek na ${resolvedUrl} vrátil HTML stránku místo výsledků analýzy.\n` +
      `Na Render.com pravděpodobně nemáte nastavenou Environment Variable VITE_API_URL směrující na váš FastAPI backend (např. https://enterprisebotbackend.onrender.com).`
    );
  }

  // 3. Parsování platné JSON odpovědi
  let data: RecommendationResponse;
  try {
    data = JSON.parse(rawText);
  } catch (jsonErr) {
    console.error(
      '%c[desideo] ❌ Chyba parsování JSON z odpovědi serveru:',
      'color: #ef4444; font-weight: bold; font-size: 13px;',
      `URL: ${resolvedUrl}`,
      jsonErr,
      `Odpověď:`, rawText
    );
    throw new Error(`Odpověď ze serveru ${resolvedUrl} nebyla ve formátu JSON: ${rawText.slice(0, 150)}`);
  }

  console.log(
    '%c[desideo] ✅ Analýza CV úspěšně dokončena!',
    'color: #10b981; font-weight: bold; font-size: 13px;',
    '\nVýsledek:', data
  );

  // If backend returned only basic fields without full candidate details, fill with sensible display names
  if (!data.extracted_candidates || data.extracted_candidates.length === 0) {
    data.extracted_candidates = [
      { candidate_name: files[0]?.name.replace(/\.pdf$/i, '') || 'Kandidát 1' },
      { candidate_name: files[1]?.name.replace(/\.pdf$/i, '') || 'Kandidát 2' },
    ];
  }

  return data;
}

