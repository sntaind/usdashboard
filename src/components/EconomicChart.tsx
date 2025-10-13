"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEconomicData } from "@/hooks/useEconomicData";

interface EconomicChartProps {
  seriesId: string;
  title: string;
  color?: string;
  height?: number;
}

export function EconomicChart({ seriesId, title, color = "#3b82f6", height = 400 }: EconomicChartProps) {
  const { data, isLoading, error } = useEconomicData(seriesId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="animate-pulse bg-gray-200 rounded h-full w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-red-500" style={{ height }}>
        Error loading data for {title}
      </div>
    );
  }

  if (!data?.observations || data.observations.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500" style={{ height }}>
        No data available for {title}
      </div>
    );
  }

  // Transform data for Recharts
  const chartData = data.observations
    .slice(0, 50) // Show last 50 data points
    .reverse() // Show chronological order
    .map((obs) => ({
      date: new Date(obs.date).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      value: parseFloat(obs.value),
      fullDate: obs.date,
    }));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            labelFormatter={(value, payload) => {
              if (payload && payload[0] && payload[0].payload) {
                return new Date(payload[0].payload.fullDate).toLocaleDateString();
              }
              return value;
            }}
            formatter={(value: number) => [value.toLocaleString(), "Value"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
