import axios from "axios";

const FRED_BASE = "https://api.stlouisfed.org/fred";

export type FredObservation = {
  date: string;
  value: string;
};

export async function fetchFredSeriesObservations(seriesId: string, params: Record<string, string | number> = {}) {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    throw new Error("FRED_API_KEY is not set");
  }
  const searchParams = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: "json",
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const url = `${FRED_BASE}/series/observations?${searchParams.toString()}`;
  const { data } = await axios.get(url);
  return data as { observations: FredObservation[] };
}

export async function fetchFredSeriesMeta(seriesId: string) {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    throw new Error("FRED_API_KEY is not set");
  }
  const searchParams = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: "json",
  });
  const url = `${FRED_BASE}/series?${searchParams.toString()}`;
  const { data } = await axios.get(url);
  return data as { seriess: Array<{ id: string; title: string; frequency: string; units_short?: string; last_updated?: string }> };
}
