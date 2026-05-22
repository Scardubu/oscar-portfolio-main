import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'SabiScore preview is not publicly exposed from the portfolio.' },
    { status: 410 }
  );
}
