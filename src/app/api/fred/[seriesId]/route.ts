import { NextRequest, NextResponse } from "next/server";
import { fetchFredSeriesObservations, fetchFredSeriesMeta } from "@/lib/fred";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { seriesId: string } }
) {
  try {
    const { seriesId } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "100";
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    // Check if we have cached data
    const cachedSeries = await prisma.series.findUnique({
      where: { code: seriesId },
      include: {
        points: {
          orderBy: { date: "desc" },
          take: parseInt(limit),
        },
      },
    });

    if (cachedSeries && cachedSeries.points.length > 0) {
      return NextResponse.json({
        series: {
          id: cachedSeries.code,
          title: cachedSeries.name,
          frequency: cachedSeries.frequency,
          units_short: cachedSeries.unit,
          last_updated: cachedSeries.lastUpdated?.toISOString(),
        },
        observations: cachedSeries.points.map((point) => ({
          date: point.date.toISOString().split("T")[0],
          value: point.value.toString(),
        })),
      });
    }

    // Fetch from FRED API
    const [observationsData, metaData] = await Promise.all([
      fetchFredSeriesObservations(seriesId, {
        limit,
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      }),
      fetchFredSeriesMeta(seriesId),
    ]);

    const seriesMeta = metaData.series[0];
    const observations = observationsData.observations.filter(
      (obs) => obs.value !== "."
    );

    // Cache the data
    const series = await prisma.series.upsert({
      where: { code: seriesId },
      update: {
        name: seriesMeta.title,
        source: "FRED",
        frequency: seriesMeta.frequency,
        unit: seriesMeta.units_short,
        lastUpdated: new Date(),
      },
      create: {
        code: seriesId,
        name: seriesMeta.title,
        source: "FRED",
        frequency: seriesMeta.frequency,
        unit: seriesMeta.units_short,
        lastUpdated: new Date(),
      },
    });

    // Cache data points
    await Promise.all(
      observations.map((obs) =>
        prisma.dataPoint.upsert({
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
        })
      )
    );

    return NextResponse.json({
      series: seriesMeta,
      observations,
    });
  } catch (error) {
    console.error("Error fetching FRED data:", error);
    return NextResponse.json(
      { error: "Failed to fetch economic data" },
      { status: 500 }
    );
  }
}
