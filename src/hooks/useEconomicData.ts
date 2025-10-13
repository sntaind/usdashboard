import useSWR from "swr";

interface FredData {
  series: {
    id: string;
    title: string;
    frequency: string;
    units_short?: string;
    last_updated?: string;
  };
  observations: Array<{
    date: string;
    value: string;
  }>;
}

const fetcher = async (url: string): Promise<FredData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch economic data");
  }
  return response.json();
};

export function useEconomicData(seriesId: string, limit: number = 100) {
  const { data, error, isLoading } = useSWR<FredData>(
    `/api/fred/${seriesId}?limit=${limit}`,
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    error,
    isLoading,
  };
}
