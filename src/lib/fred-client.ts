const FRED_BASE = "https://api.stlouisfed.org/fred";

export type FredObservation = {
  date: string;
  value: string;
};

export async function fetchFredSeriesObservations(seriesId: string, params: Record<string, string | number> = {}) {
  const apiKey = "8be6c81c505eec5524b0c911d670190b"; // Using the API key directly for client-side calls
  const searchParams = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: "json",
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const url = `${FRED_BASE}/series/observations?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data as { observations: FredObservation[] };
}

export async function fetchFredSeriesMeta(seriesId: string) {
  const apiKey = "8be6c81c505eec5524b0c911d670190b"; // Using the API key directly for client-side calls
  const searchParams = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: "json",
  });
  const url = `${FRED_BASE}/series?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data as { seriess: Array<{ id: string; title: string; frequency: string; units_short?: string; last_updated?: string }> };
}
