"use client";
import useSWR from "swr";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { format } from "date-fns";
import { useState, useEffect } from "react";

// Custom tooltip component with direct cursor tracking
const CustomTooltip = ({ active, payload, label, isSelected }: any) => {
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
        <div>{format(new Date(label), "yyyy-MM-dd")}</div>
        <div>{payload[0].value.toFixed(2)}</div>
      </div>
    );
  }
  return null;
};

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
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
  const endpoint = code === "FINRA_MARGIN_DEBT" ? "/api/finra/margin-debt" : (code ? `/api/series/${encodeURIComponent(code)}` : null);
  const { data, isLoading, error } = useSWR(endpoint, fetcher, { revalidateOnFocus: false });

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
              .map((p: any) => ({ date: new Date(p.date).getTime(), value: Number(p.value) }))
              .filter((p: any) => (code === "FINRA_MARGIN_DEBT" ? p.date >= new Date(2022, 0, 1).getTime() : true))} margin={{ top: 8, right: isSelected ? 24 : 12, left: 8, bottom: 8 }}>
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