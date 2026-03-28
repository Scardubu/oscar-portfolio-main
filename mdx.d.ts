/**
 * Ambient shim for 'mdx/types' — provides MDXComponents type.
 * The actual '@types/mdx' package is in the pnpm store but not linked.
 * This shim keeps TypeScript happy; '@types/mdx' should be added to devDependencies.
 */
declare module 'mdx/types' {
  /**
   * Map of element names to React components used by MDX renderers.
   * Using a permissive index signature so all component shapes are accepted.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type MDXComponents = { [key: string]: any };
  export type { MDXComponents };
}
