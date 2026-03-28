import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      todayPredictions: null,
      systemStatus: "operational",
      uptime: 99.94,
      note: "Public portfolio does not expose real-time prediction counts.",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
