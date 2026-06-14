import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#09090E',
          padding: '80px',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ color: '#22C55E', fontSize: 14, letterSpacing: '0.1em' }}>
            AVAILABLE - FULLSTACK · STAFF+ · CONSULTING
          </span>
        </div>
        <div>
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 14,
              letterSpacing: '0.15em',
              marginBottom: 16,
            }}
          >
            FULLSTACK ENGINEER · AI INFRASTRUCTURE · FINTECH SYSTEMS
          </p>
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '0.24em',
              margin: 0,
            }}
          >
            SCARDUBU
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 20,
              marginTop: 16,
              maxWidth: '70%',
              lineHeight: 1.4,
            }}
          >
            Fullstack systems that ship. Reliable infrastructure. Clear operating decisions.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 24,
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'monospace' }}>
            scardubu.dev
          </span>
          <span style={{ color: '#67E8F9', fontSize: 13, fontFamily: 'monospace' }}>
            TaxBridge · SabiScore · Fullstack Systems
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}