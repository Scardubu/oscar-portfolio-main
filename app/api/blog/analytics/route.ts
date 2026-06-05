import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type BlogAnalyticsEvent =
  | {
      event: 'page_view';
      path: string;
      ts?: string;
      referrer?: string | null;
      userAgent?: string | null;
    }
  | {
      event: 'impression' | 'click';
      path: string;
      slug: string;
      tier: 1 | 2 | 3;
      mode: 'local' | 'keyword' | 'semantic';
      rank?: number;
      score?: number;
      query?: string;
      tag?: string | null;
      ts?: string;
      referrer?: string | null;
      userAgent?: string | null;
    }
  | {
      event: 'search';
      path: string;
      query: string;
      tag?: string | null;
      mode: 'local' | 'keyword' | 'semantic';
      resultCount: number;
      durationMs: number;
      ts?: string;
      referrer?: string | null;
      userAgent?: string | null;
    }
  | {
      event: 'tag_change';
      path: string;
      tag: string | null;
      ts?: string;
      referrer?: string | null;
      userAgent?: string | null;
    };

function isValidEvent(payload: unknown): payload is BlogAnalyticsEvent {
  if (!payload || typeof payload !== 'object') return false;
  const event = (payload as { event?: unknown }).event;
  return typeof event === 'string';
}

/** Truncate string fields before forwarding to prevent oversized webhook payloads. */
function sanitizeRecord(record: Record<string, unknown>): Record<string, unknown> {
  const cap = (v: unknown, max: number): unknown => (typeof v === 'string' ? v.slice(0, max) : v);
  return {
    ...record,
    path: cap(record.path, 500),
    query: cap(record.query, 200),
    slug: cap(record.slug, 200),
    tag: cap(record.tag, 100),
    userAgent: cap(record.userAgent, 500),
    referrer: cap(record.referrer, 500),
  };
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'blog-analytics' });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;

    if (!isValidEvent(payload)) {
      return NextResponse.json({ ok: false, error: 'Invalid analytics event' }, { status: 400 });
    }

    const record = sanitizeRecord({
      ...(payload as Record<string, unknown>),
      receivedAt: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') ?? null,
    });

    const webhookUrl = process.env.BLOG_ANALYTICS_WEBHOOK_URL;

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
        cache: 'no-store',
      });
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn('[blog analytics]', JSON.stringify(record));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown analytics error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
