import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EconomicIndicatorCardProps {
  title: string;
  value?: string;
  unit?: string;
  isLoading?: boolean;
  trend?: "up" | "down" | "neutral";
}

export function EconomicIndicatorCard({
  title,
  value,
  unit,
  isLoading,
  trend = "neutral",
}: EconomicIndicatorCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className={`text-sm font-medium ${getTrendColor()}`}>
          {getTrendIcon()}
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          ) : (
            <>
              {value ? parseFloat(value).toLocaleString() : "N/A"}
              {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Latest available data
        </p>
      </CardContent>
    </Card>
  );
}
