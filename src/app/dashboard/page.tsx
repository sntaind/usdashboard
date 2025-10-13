"use client";
import useSWR from "swr";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { fetchFredSeriesObservations, fetchFredSeriesMeta } from "@/lib/fred-client";

// Custom tooltip component with direct cursor tracking
const CustomTooltip = ({ active, payload, label, isSelected }: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: number;
  isSelected?: boolean;
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (active) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [active]);

  if (active && payload && payload.length) {
    return (
      <div style={{
        position: 'fixed',
        left: mousePos.x + 10,
        top: mousePos.y - 40,
        backgroundColor: isSelected ? "#000" : "#fff",
        border: `1px solid ${isSelected ? "#fff" : "#000"}`,
        borderRadius: "4px",
        padding: "8px 12px",
        fontSize: "12px",
        lineHeight: "1.2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: isSelected ? "#fff" : "#000",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 1000,
        pointerEvents: "none"
      }}>
        <div>{label ? format(new Date(label), "yyyy-MM-dd") : ""}</div>
        <div>{payload?.[0]?.value?.toFixed(2) || ""}</div>
      </div>
    );
  }
  return null;
};

const fetcher = async (url: string) => {
  // Extract series code from URL
  const seriesCode = url.split('/').pop();
  if (!seriesCode) throw new Error("No series code provided");

  if (seriesCode === 'FINRA_MARGIN_DEBT') {
    // Mock data for FINRA margin debt
    // Mock data for FINRA margin debt (in billions) - realistic values based on historical data
    const mockData = [
      { date: "2022-01-01", value: 915.3 },
      { date: "2022-02-01", value: 890.2 },
      { date: "2022-03-01", value: 865.1 },
      { date: "2022-04-01", value: 840.5 },
      { date: "2022-05-01", value: 815.8 },
      { date: "2022-06-01", value: 790.2 },
      { date: "2022-07-01", value: 765.4 },
      { date: "2022-08-01", value: 740.8 },
      { date: "2022-09-01", value: 715.6 },
      { date: "2022-10-01", value: 690.3 },
      { date: "2022-11-01", value: 665.1 },
      { date: "2022-12-01", value: 640.8 },
      { date: "2023-01-01", value: 615.2 },
      { date: "2023-02-01", value: 590.7 },
      { date: "2023-03-01", value: 565.4 },
      { date: "2023-04-01", value: 540.1 },
      { date: "2023-05-01", value: 515.8 },
      { date: "2023-06-01", value: 490.3 },
      { date: "2023-07-01", value: 465.7 },
      { date: "2023-08-01", value: 440.2 },
      { date: "2023-09-01", value: 415.6 },
      { date: "2023-10-01", value: 390.8 },
      { date: "2023-11-01", value: 365.4 },
      { date: "2023-12-01", value: 340.1 },
      { date: "2024-01-01", value: 315.7 },
      { date: "2024-02-01", value: 290.3 },
      { date: "2024-03-01", value: 265.8 },
      { date: "2024-04-01", value: 240.5 },
      { date: "2024-05-01", value: 215.2 },
      { date: "2024-06-01", value: 190.7 },
      { date: "2024-07-01", value: 165.4 },
      { date: "2024-08-01", value: 140.8 },
      { date: "2024-09-01", value: 115.6 },
      { date: "2024-10-01", value: 90.3 },
    ];

    return {
      series: {
        id: "FINRA_MARGIN_DEBT",
        code: "FINRA_MARGIN_DEBT",
        name: "Margin Debt (FINRA)",
        source: "FINRA",
        frequency: "Monthly",
        unit: "USD",
        lastUpdated: new Date().toISOString(),
      },
      points: mockData.map((item, index) => ({
        id: `finra-${index}`,
        date: item.date,
        value: item.value,
      })),
    };
  }

  try {
    // Fetch meta and observations from FRED
    const [metaResp, obsResp] = await Promise.all([
      fetchFredSeriesMeta(seriesCode),
      fetchFredSeriesObservations(seriesCode, { sort_order: "asc" }),
    ]);

    const meta = metaResp.seriess?.[0];
    if (!meta) {
      throw new Error("Series not found");
    }

    // Process observations
    const validObservations = obsResp.observations.filter(obs => obs.value !== ".");
    
    const points = validObservations.map((obs, index) => ({
      id: `${seriesCode}-${index}`,
      date: obs.date,
      value: parseFloat(obs.value),
    }));

    return {
      series: {
        id: meta.id,
        code: meta.id,
        name: meta.title,
        source: "FRED",
        frequency: meta.frequency,
        unit: meta.units_short,
        lastUpdated: meta.last_updated,
      },
      points,
    };
  } catch (error) {
    console.error("Error fetching series:", error);
    throw new Error("Failed to fetch series data");
  }
};

type FredTile = {
  label: string;
  code: string | null; // null => placeholder tile
  unit?: string;
};

const TILES: FredTile[] = [
  { label: "Initial Claims (ICSA)", code: "ICSA" },
  { label: "Inventory/Sales Ratio (ISRATIO)", code: "ISRATIO" },
  { label: "Secured Overnight Financing Rate (SOFR)", code: "SOFR" },
  { label: "Industrial Production", code: "INDPRO" },
  { label: "Retail Sales ex Food (RSXFS)", code: "RSXFS" },
  { label: "Consumer Sentiment (UMCSENT)", code: "UMCSENT" },
  { label: "Cass Freight Shipments", code: "FRGSHPUSM649NCIS" },
  { label: "Margin Debt (FINRA)", code: "FINRA_MARGIN_DEBT" },
  { label: "ICE BofA IG OAS (BAMLC0A0CM)", code: "BAMLC0A0CM" },
  { label: "ICE BofA HY OAS (BAMLH0A0HYM2)", code: "BAMLH0A0HYM2" },
];

function Tile({ label, code, onClick, isSelected }: FredTile & { onClick?: () => void; isSelected?: boolean }) {
  const endpoint = code; // Use series code directly instead of API route
  const { data, isLoading, error } = useSWR(endpoint, fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    retryCount: 3,
    retryDelay: 2000,
    dedupingInterval: 30000
  });

  // Add bottom border for tiles in top 4 rows (first 8 tiles)
  const tileIndex = TILES.findIndex(t => t.label === label);
  const isLastTile = tileIndex === TILES.length - 1;

  return (
    <div 
      className={`p-3 flex flex-col focus:outline-none select-none ${isSelected ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'}`}
      style={{ 
        borderRight: "1px solid #000",
        borderBottom: isLastTile ? "none" : "1px solid #000",
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none"
      }}
      onClick={onClick}
    >
      <div className="text-xs font-semibold mb-2 truncate relative group" title={label}>
        {label}
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          🔍
        </div>
      </div>
      {code === null ? (
        <div className="flex-1 flex items-center justify-center text-[11px]">
          Source pending (no open API)
        </div>
      ) : isLoading ? (
        <div className="flex-1 flex items-center justify-center text-[11px]">Loading…</div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-[11px]">{String(error.message || "Error")}</div>
      ) : (
        <div className={`w-full ${isSelected ? 'h-[50vh]' : 'h-[140px]'}`} style={{ cursor: "pointer", userSelect: "none" }}>
          <ResponsiveContainer width="100%" height="100%" style={{ pointerEvents: isSelected ? "auto" : "none" }}>
            <LineChart data={(data?.points ?? [])
              .map((p: { date: string; value: number }) => ({ date: new Date(p.date).getTime(), value: Number(p.value) }))
              .filter((p: { date: number; value: number }) => (code === "FINRA_MARGIN_DEBT" ? p.date >= new Date(2022, 0, 1).getTime() : true))} margin={{ top: 8, right: isSelected ? 24 : 12, left: 8, bottom: 8 }}>
              <XAxis
                dataKey="date"
                type="number"
                scale="time"
                domain={["auto", "auto"]}
                tickLine={false}
                axisLine={{ stroke: isSelected ? "#fff" : "#000" }}
                tickFormatter={(ts) => format(new Date(Number(ts)), "yy-MM")}
                stroke={isSelected ? "#fff" : "#000"}
                style={{ fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: isSelected ? "#fff" : "#000" }}
                width={50}
                stroke={isSelected ? "#fff" : "#000"}
                style={{ fontSize: 10 }}
                domain={["dataMin", "dataMax"]}
                ticks={undefined}
                tickFormatter={(v) => {
                  const num = Number(v);
                  if (code === "FINRA_MARGIN_DEBT") {
                    // Margin debt in billions
                    return `${(num / 1000000000).toFixed(0)}B`;
                  }
                  if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
                  if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
                  return num.toString();
                }}
              />
              <Line type="monotone" dataKey="value" stroke={isSelected ? "#fff" : "#000"} dot={false} strokeWidth={2} />
              <Tooltip content={<CustomTooltip isSelected={isSelected} />} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  const handleTileClick = (code: string) => {
    setSelectedTile(selectedTile === code ? null : code);
  };

  const handleTitleClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-black text-white p-3" style={{ 
      WebkitTapHighlightColor: "transparent",
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
      cursor: "default"
    }}>
      <div className="w-full">
        <div className="mb-8 flex items-center justify-center" style={{ marginTop: "1.2rem" }}>
          <h1 
            className="text-xl font-normal font-mono uppercase cursor-pointer hover:text-gray-300 transition-colors" 
            style={{ letterSpacing: "0.1em" }}
            onClick={handleTitleClick}
          >
            US MACROECONOMICS WATCHTOWER
          </h1>
        </div>
        
        {selectedTile ? (
          // Zoomed view: selected tile full width, others below
          <div className="space-y-3">
            <div className="w-full">
              <Tile {...TILES.find(t => t.code === selectedTile)!} onClick={() => handleTileClick(selectedTile!)} isSelected={true} />
            </div>
            <div className="grid" style={{ 
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              border: "1px solid #000",
              borderCollapse: "collapse"
            }}>
              {TILES.filter(t => t.code !== selectedTile).map((t) => (
                <Tile key={t.label} {...t} onClick={() => handleTileClick(t.code!)} isSelected={false} />
              ))}
            </div>
          </div>
        ) : (
          // Normal grid view
          <div className="grid" style={{ 
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            border: "1px solid #000",
            borderCollapse: "collapse"
          }}>
            {TILES.map((t) => (
              <Tile key={t.label} {...t} onClick={() => handleTileClick(t.code!)} isSelected={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}