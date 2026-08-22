import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';
import { Children, isValidElement, type ReactNode } from 'react';

import { CodeBlockClient } from '@/components/CodeBlockClient';

function extractLanguage(className?: string): string | undefined {
  if (!className) return undefined;
  const match = /language-(\w+)/.exec(className);
  return match ? match[1] : undefined;
}

function extractTextContent(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractTextContent).join('');
  if (isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    if (props.children) return extractTextContent(props.children);
  }
  return '';
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // ── Headings ────────────────────────────────────────────────────────────
    h1: ({ children }: { children?: ReactNode }) => (
      <h1
        className="mt-10 mb-5 text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2
        className="mt-10 mb-4 text-2xl sm:text-3xl font-semibold tracking-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3
        className="mt-8 mb-3 text-xl font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: ReactNode }) => (
      <h4
        className="mt-6 mb-2 text-base font-semibold uppercase tracking-widest font-mono"
        style={{ color: 'var(--color-film-teal)' }}
      >
        {children}
      </h4>
    ),

    // ── Body ────────────────────────────────────────────────────────────────
    p: ({ children }: { children?: ReactNode }) => (
      <p
        className="mb-5 text-base leading-8 max-w-[68ch]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {children}
      </p>
    ),

    // ── Links ───────────────────────────────────────────────────────────────
    a: ({ href, children }: { href?: string; children?: ReactNode }) => {
      const isExternal = href?.startsWith('http');
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors"
            style={{ color: 'var(--color-film-teal)' }}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href ?? '#'}
          className="underline underline-offset-2 transition-colors"
          style={{ color: 'var(--color-film-teal)' }}
        >
          {children}
        </Link>
      );
    },

    // ── Lists ───────────────────────────────────────────────────────────────
    ul: ({ children }: { children?: ReactNode }) => (
      <ul
        className="mb-5 space-y-2 pl-5 list-disc"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol
        className="mb-5 space-y-2 pl-5 list-decimal"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {children}
      </ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="text-base leading-7">{children}</li>
    ),

    // ── Emphasis ────────────────────────────────────────────────────────────
    strong: ({ children }: { children?: ReactNode }) => (
      <strong
        className="font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {children}
      </strong>
    ),
    em: ({ children }: { children?: ReactNode }) => (
      <em
        className="italic"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {children}
      </em>
    ),

    // ── Inline code ─────────────────────────────────────────────────────────
    code: ({ children, className }: { children?: ReactNode; className?: string }) => {
      // Block code: handled below via pre > code
      if (className) return <code className={className}>{children}</code>;
      return (
        <code
          className="rounded px-1.5 py-0.5 font-mono text-[0.875em]"
          style={{
            background: 'oklch(100% 0 0 / 0.06)',
            color: 'var(--color-film-teal)',
            border: '1px solid oklch(100% 0 0 / 0.1)',
          }}
        >
          {children}
        </code>
      );
    },

    // ── Code blocks ─────────────────────────────────────────────────────────
    pre: ({ children }: { children?: ReactNode }) => {
      // Extract code string and language from children
      const childArray = Children.toArray(children);
      const codeEl = childArray.find(
        (child): child is React.ReactElement =>
          isValidElement(child) && (child as React.ReactElement).type === 'code'
      );

      if (codeEl) {
        const props = codeEl.props as { children?: ReactNode; className?: string };
        const lang  = extractLanguage(props.className);
        const code  = extractTextContent(props.children).replace(/\n$/, '');

        return (
          <CodeBlockClient language={lang ?? 'text'}>
            {code}
          </CodeBlockClient>
        );
      }

      return (
        <pre
          className="my-6 overflow-x-auto rounded-[var(--radius-md)] p-4 font-mono text-sm leading-6"
          tabIndex={0}
          aria-label="Code sample"
          style={{
            background: 'oklch(100% 0 0 / 0.04)',
            border: '1px solid var(--color-border)',
          }}
        >
          {children}
        </pre>
      );
    },

    // ── Blockquote ──────────────────────────────────────────────────────────
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote
        className="my-6 border-l-2 py-1 pl-5 italic"
        style={{
          borderLeftColor: 'var(--color-film-teal)',
          color: 'var(--color-text-secondary)',
        }}
      >
        {children}
      </blockquote>
    ),

    // ── Horizontal rule ─────────────────────────────────────────────────────
    hr: () => (
      <hr
        className="my-10 border-t"
        style={{ borderColor: 'var(--color-border)' }}
      />
    ),

    // ── Tables ──────────────────────────────────────────────────────────────
    table: ({ children }: { children?: ReactNode }) => (
      <div className="my-6 w-full overflow-x-auto rounded-[var(--radius-md)] border" style={{ borderColor: 'var(--color-border)' }}>
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: { children?: ReactNode }) => (
      <thead style={{ background: 'oklch(100% 0 0 / 0.03)' }}>{children}</thead>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th
        className="border-b px-4 py-3 text-left font-mono text-[11px] tracking-widest uppercase"
        style={{
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td
        className="border-b px-4 py-3 text-sm leading-6"
        style={{
          borderColor: 'var(--color-border-subtle)',
          color: 'var(--color-text-secondary)',
        }}
      >
        {children}
      </td>
    ),

    // ── Images ──────────────────────────────────────────────────────────────
    img: ({ src, alt }: { src?: string; alt?: string }) => {
      if (!src) return null;
      return (
        <figure className="my-8">
          <Image
            src={src}
            alt={alt ?? ''}
            width={800}
            height={450}
            className="w-full rounded-[var(--radius-lg)] border"
            style={{ borderColor: 'var(--color-border)' }}
          />
          {alt && (
            <figcaption
              className="mt-3 text-center font-mono text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {alt}
            </figcaption>
          )}
        </figure>
      );
    },

    ...components,
  };
}
