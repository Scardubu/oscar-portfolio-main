import { NextResponse } from 'next/server';

type PortfolioMetricsResponse = {
  uptime: {
    percentage: number;
    last90DaysIncidents: number;
  };
  performance: {
    fcpMs: number;
    lcpMs: number;
    ttfbMs: number;
    bundleKb: number;
  };
  traffic: {
    monthlyVisitors: number;
    avgSessionSeconds: number;
  };
  meta: {
    source: 'portfolio-benchmarks';
    updatedAt: string;
  };
};

const PORTFOLIO_METRICS: PortfolioMetricsResponse = {
  uptime: {
    percentage: 99.94,
    last90DaysIncidents: 1,
  },
  performance: {
    fcpMs: 120,
    lcpMs: 420,
    ttfbMs: 80,
    bundleKb: 280,
  },
  traffic: {
    monthlyVisitors: 350,
    avgSessionSeconds: 180,
  },
  meta: {
    source: 'portfolio-benchmarks',
    updatedAt: '2026-03-29T00:00:00.000Z',
  },
};

export async function GET() {
  return NextResponse.json(PORTFOLIO_METRICS, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
    },
  });
}
