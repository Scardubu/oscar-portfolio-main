import type React from 'react';

const linkStyle: React.CSSProperties = {
  fontFamily:    'var(--font-mono)',
  fontSize:      'var(--text-xs)',
  color:         'var(--color-text-muted)',
  textDecoration:'none',
  letterSpacing: 'var(--tracking-wide)',
  textTransform: 'uppercase' as const,
  transition:    'color var(--dur-fast)',
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        padding:   '2rem 0',
        position:  'relative',
        zIndex:    2,
      }}
    >
      <div
        className="container"
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          flexWrap:       'wrap',
          gap:            '1rem',
        }}
      >
        <span
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      'var(--text-xs)',
            color:         'var(--color-text-muted)',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          scardubu.dev · {year}
        </span>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a
            href="https://github.com/Scardubu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Oscar Ndugbu on GitHub"
            style={linkStyle}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/oscardubu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Oscar Ndugbu on LinkedIn"
            style={linkStyle}
          >
            LinkedIn
          </a>
          <a
            href="mailto:scardubu@gmail.com"
            aria-label="Email Oscar Ndugbu"
            style={linkStyle}
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
