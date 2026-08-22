import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'not-published',
    metrics: null,
    note: 'Measured performance evidence is retained in release artifacts, not simulated by this endpoint.',
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
    },
  });
}
