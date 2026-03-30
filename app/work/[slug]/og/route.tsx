import { ImageResponse } from '@vercel/og';

import { projects } from '@/data/projects';

export const runtime = 'edge';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.id === slug);

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: 80,
        background: 'linear-gradient(135deg, #09090e 0%, #0f0f17 100%)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 80,
          right: 80,
          height: 2,
          background:
            'linear-gradient(90deg,transparent,rgba(99,102,241,0.8),rgba(34,211,238,0.5),transparent)',
        }}
      />
      <div
        style={{
          fontSize: 11,
          color: 'rgba(34,211,238,0.8)',
          letterSpacing: 6,
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        Oscar Scardubu · Case Study
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: 'rgba(255,255,255,0.92)',
          lineHeight: 1,
          marginBottom: 20,
        }}
      >
        {project?.title ?? 'Case Study'}
      </div>
      <div
        style={{
          fontSize: 22,
          color: 'rgba(255,255,255,0.52)',
          maxWidth: 680,
          lineHeight: 1.5,
        }}
      >
        {project?.tagline ?? ''}
      </div>
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.28)' }}>
          scardubu.dev/work/{slug}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: project?.status === 'live' ? '#22c55e' : '#f59e0b',
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.38)',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {project?.status ?? 'live'}
          </span>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
