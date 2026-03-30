import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, isValidElement, Children } from 'react';
import { CodeBlockClient } from '@/components/CodeBlockClient';

// Helper to extract language from className (e.g., "language-python" -> "python")
function extractLanguage(className?: string): string | undefined {
  if (!className) return undefined;
  const match = /language-(\w+)/.exec(className);
  return match ? match[1] : undefined;
}

// Helper to extract text content from React children
function extractTextContent(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractTextContent).join('');
  if (isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    if (props.children) {
      return extractTextContent(props.children);
    }
  }
  return '';
}

// Custom components for MDX content
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Override default elements with styled versions
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight text-white">{children}</h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="mt-8 mb-3 text-2xl font-semibold tracking-tight text-white">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="mt-6 mb-2 text-xl font-semibold text-white">{children}</h3>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p className="mb-4 text-base leading-7 text-gray-300">{children}</p>
    ),
    a: ({ href, children }: { href?: string; children?: ReactNode }) => {
      const isExternal = href?.startsWith('http');
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:text-accent-primary/80 underline underline-offset-2 transition-colors"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href || '#'}
          className="text-accent-primary hover:text-accent-primary/80 underline underline-offset-2 transition-colors"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
    em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="mb-4 list-inside list-disc space-y-2 text-gray-300">{children}</ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="mb-4 list-inside list-decimal space-y-2 text-gray-300">{children}</ol>
    ),
    li: ({ children }: { children?: ReactNode }) => <li className="text-gray-300">{children}</li>,
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-accent-primary/50 my-6 rounded-r-lg border-l-4 bg-white/5 py-2 pl-4 text-gray-400 italic">
        {children}
      </blockquote>
    ),
    // Inline code (single backticks)
    code: ({ children, className }: { children?: ReactNode; className?: string }) => {
      // If this code element has a language class, it's likely inside a pre block
      // and will be handled by the pre component below
      if (className?.includes('language-')) {
        return <code className={className}>{children}</code>;
      }
      // Inline code styling
      return (
        <code className="text-accent-primary rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">
          {children}
        </code>
      );
    },
    // Fenced code blocks (triple backticks) - automatically use CodeBlockClient
    pre: ({ children }: { children?: ReactNode }) => {
      // Extract the code element and its props
      const codeElement = Children.toArray(children).find(
        (child) => isValidElement(child) && child.type === 'code'
      );

      if (isValidElement(codeElement)) {
        const { className, children: codeChildren } = codeElement.props as {
          className?: string;
          children?: ReactNode;
        };
        const language = extractLanguage(className);
        const codeText = extractTextContent(codeChildren);

        return <CodeBlockClient language={language}>{codeText}</CodeBlockClient>;
      }

      // Fallback for non-standard pre blocks
      return (
        <pre className="bg-bg-secondary my-6 overflow-x-auto rounded-lg border border-white/10 p-4 font-mono text-sm">
          {children}
        </pre>
      );
    },
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={450}
        className="my-6 w-full rounded-lg"
      />
    ),
    hr: () => <hr className="my-8 border-white/10" />,
    table: ({ children }: { children?: ReactNode }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse">{children}</table>
      </div>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th className="border-b border-white/10 bg-white/5 p-3 text-left font-semibold text-white">
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td className="border-b border-white/10 p-3 text-gray-300">{children}</td>
    ),

    // Custom components for blog posts
    Callout: ({
      type = 'info',
      children,
    }: {
      type?: 'info' | 'warning' | 'success' | 'error';
      children: ReactNode;
    }) => {
      const styles = {
        info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
        warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        success: 'bg-green-500/10 border-green-500/30 text-green-400',
        error: 'bg-red-500/10 border-red-500/30 text-red-400',
      };
      return <div className={`my-6 rounded-r-lg border-l-4 p-4 ${styles[type]}`}>{children}</div>;
    },

    CodeBlock: CodeBlockClient,

    ...components,
  };
}
