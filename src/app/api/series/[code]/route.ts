import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchFredSeriesMeta, fetchFredSeriesObservations } from "@/lib/fred";

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;
  try {
    // Fetch meta and observations from FRED
    const [metaResp, obsResp] = await Promise.all([
      fetchFredSeriesMeta(code),
      fetchFredSeriesObservations(code, { sort_order: "asc" }),
    ]);

    const meta = metaResp.seriess?.[0];
    if (!meta) {
      return Response.json({ error: "Series not found" }, { status: 404 });
    }

    const series = await prisma.series.upsert({
      where: { code },
      update: {
        name: meta.title,
        source: "FRED",
        frequency: meta.frequency,
        unit: meta.units_short,
        lastUpdated: new Date(),
      },
      create: {
        code,
        name: meta.title,
        source: "FRED",
        frequency: meta.frequency,
        unit: meta.units_short,
        lastUpdated: new Date(),
      },
    });

    // Process observations and store in database
    const validObservations = obsResp.observations.filter(obs => obs.value !== ".");
    
    for (const obs of validObservations) {
      await prisma.dataPoint.upsert({
        where: {
          seriesId_date: {
            seriesId: series.id,
            date: new Date(obs.date),
          },
        },
        update: { value: parseFloat(obs.value) },
        create: {
          seriesId: series.id,
          date: new Date(obs.date),
          value: parseFloat(obs.value),
        },
      });
    }

    // Fetch stored points
    const points = await prisma.dataPoint.findMany({
      where: { seriesId: series.id },
      orderBy: { date: "asc" },
    });

    return Response.json({
      series: {
        id: series.id,
        code: series.code,
        name: series.name,
        source: series.source,
        frequency: series.frequency,
        unit: series.unit,
        lastUpdated: series.lastUpdated,
      },
      points: points.map(p => ({
        id: p.id,
        date: p.date.toISOString(),
        value: p.value,
      })),
    });
  } catch (error) {
    console.error("Error fetching series:", error);
    return Response.json({ error: "Failed to fetch series data" }, { status: 500 });
  }
}