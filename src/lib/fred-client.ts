const FRED_BASE = "https://api.stlouisfed.org/fred";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export type FredObservation = {
  date: string;
  value: string;
};

export async function fetchFredSeriesObservations(seriesId: string, params: Record<string, string | number> = {}) {
  const apiKey = "8be6c81c505eec5524b0c911d670190b";
  const searchParams = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: "json",
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const url = `${FRED_BASE}/series/observations?${searchParams.toString()}`;
  
  try {
    // Try direct fetch first
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data as { observations: FredObservation[] };
    }
  } catch (error) {
    console.log("Direct fetch failed, trying CORS proxy...");
  }
  
  // Fallback to CORS proxy
  const proxyUrl = `${CORS_PROXY}${url}`;
  const response = await fetch(proxyUrl, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  const data = await response.json();
  return data as { observations: FredObservation[] };
}

export async function fetchFredSeriesMeta(seriesId: string) {
  const apiKey = "8be6c81c505eec5524b0c911d670190b";
  const searchParams = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: "json",
  });
  const url = `${FRED_BASE}/series?${searchParams.toString()}`;
  
  try {
    // Try direct fetch first
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data as { seriess: Array<{ id: string; title: string; frequency: string; units_short?: string; last_updated?: string }> };
    }
  } catch (error) {
    console.log("Direct fetch failed, trying CORS proxy...");
  }
  
  // Fallback to CORS proxy
  const proxyUrl = `${CORS_PROXY}${url}`;
  const response = await fetch(proxyUrl, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  const data = await response.json();
  return data as { seriess: Array<{ id: string; title: string; frequency: string; units_short?: string; last_updated?: string }> };
}
