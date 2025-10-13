import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // For now, return mock data for FINRA margin debt
    // In a real implementation, you would fetch from FINRA API
    const mockData = [
      { date: "2022-01-01", value: 1000000000000 },
      { date: "2022-02-01", value: 1020000000000 },
      { date: "2022-03-01", value: 980000000000 },
      { date: "2022-04-01", value: 1050000000000 },
      { date: "2022-05-01", value: 1100000000000 },
      { date: "2022-06-01", value: 1080000000000 },
      { date: "2022-07-01", value: 1120000000000 },
      { date: "2022-08-01", value: 1150000000000 },
      { date: "2022-09-01", value: 1130000000000 },
      { date: "2022-10-01", value: 1180000000000 },
      { date: "2022-11-01", value: 1200000000000 },
      { date: "2022-12-01", value: 1220000000000 },
      { date: "2023-01-01", value: 1250000000000 },
      { date: "2023-02-01", value: 1280000000000 },
      { date: "2023-03-01", value: 1300000000000 },
      { date: "2023-04-01", value: 1320000000000 },
      { date: "2023-05-01", value: 1350000000000 },
      { date: "2023-06-01", value: 1380000000000 },
      { date: "2023-07-01", value: 1400000000000 },
      { date: "2023-08-01", value: 1420000000000 },
      { date: "2023-09-01", value: 1450000000000 },
      { date: "2023-10-01", value: 1480000000000 },
      { date: "2023-11-01", value: 1500000000000 },
      { date: "2023-12-01", value: 1520000000000 },
      { date: "2024-01-01", value: 1550000000000 },
      { date: "2024-02-01", value: 1580000000000 },
      { date: "2024-03-01", value: 1600000000000 },
      { date: "2024-04-01", value: 1620000000000 },
      { date: "2024-05-01", value: 1650000000000 },
      { date: "2024-06-01", value: 1680000000000 },
      { date: "2024-07-01", value: 1700000000000 },
      { date: "2024-08-01", value: 1720000000000 },
      { date: "2024-09-01", value: 1750000000000 },
      { date: "2024-10-01", value: 1780000000000 },
    ];

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error fetching FINRA margin debt:", error);
    return NextResponse.json(
      { error: "Failed to fetch margin debt data" },
      { status: 500 }
    );
  }
}