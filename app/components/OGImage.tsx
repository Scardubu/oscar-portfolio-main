interface OGImageProps {
  title?: string;
  subtitle?: string;
  caption?: string;
}

export function OGImage({
  title = 'Oscar Dubu',
  subtitle = 'Production AI systems · Full-stack execution',
  caption = 'Shipped work, explicit tradeoffs, and interface quality that reads without explanation.',
}: OGImageProps) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        background: '#0a0a0f',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.14,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.1))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: 90,
          width: 360,
          height: 360,
          borderRadius: '999px',
          background:
            'radial-gradient(circle, rgba(0,212,255,0.28), rgba(0,212,255,0.02) 68%, transparent 75%)',
          filter: 'blur(28px)',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          padding: '72px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div
            style={{
              display: 'flex',
              padding: '10px 18px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.06)',
              fontSize: 22,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(226,232,240,0.82)',
            }}
          >
            Nigeria NG · Remote-First
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 22,
              color: 'rgba(226,232,240,0.78)',
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: '#00d4ff',
                boxShadow: '0 0 24px rgba(0,212,255,0.7)',
              }}
            />
            Active build surface
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '72%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: '-0.05em' }}>{title}</div>
            <div style={{ fontSize: 34, color: '#00d4ff' }}>{subtitle}</div>
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: 'rgba(226,232,240,0.88)' }}>
            {caption}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 18 }}>
          {['Work that shipped', 'How I build', "What I've owned"].map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                padding: '14px 18px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(248,250,252,0.82)',
                fontSize: 22,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
