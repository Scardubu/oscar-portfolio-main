/**
 * lib/config.ts
 *
 * Single source of truth for environment-specific URL configuration.
 *
 * CRITICAL DISTINCTION — two functions, two contexts:
 *
 *   anchorUrl('#contact')
 *     → Returns '/#contact' (root-relative)
 *     → USE FOR: Next.js <Link href>, HTML <a href> for same-page anchors
 *     → WHY: Next.js Link with an absolute URL triggers a full hard page reload.
 *            A root-relative path uses client-side navigation correctly.
 *
 *   canonicalSectionUrl('contact')
 *     → Returns 'https://scardubu.dev/#contact' (absolute)
 *     → USE FOR: <meta> tags, og:url, sitemap.xml, JSON-LD only
 *     → NEVER USE IN: <Link href> or <a href> for in-page navigation
 *
 * Previous version had sectionUrl() returning an absolute URL and it was
 * used in Navbar <Link> components — causing a full page reload on every
 * nav click. That function is removed. Use anchorUrl() instead.
 */

export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scardubu.dev'

export const BLOG_BASE: string = `${SITE_URL}/blog`

// ─── Blog URLs ────────────────────────────────────────────────────────────────

/**
 * Canonical URL for a blog post.
 * Used in BlogBridge, FeaturedArticle, blog-articles.ts.
 * These are external links — absolute URLs are correct here.
 */
export function blogUrl(slug: string): string {
  return `${BLOG_BASE}/${slug}`
}

// ─── In-page anchor navigation ────────────────────────────────────────────────

/**
 * Root-relative anchor link — safe for Next.js <Link> and <a> same-page nav.
 *
 * Returns: '/#section-id'
 *
 * Example:
 *   anchorUrl('contact')  → '/#contact'
 *   anchorUrl('projects') → '/#projects'
 *
 * Use everywhere a nav link or CTA points to a section on the homepage.
 */
export function anchorUrl(anchor: string): string {
  return `/#${anchor}`
}

// ─── Canonical absolute URLs (meta/SEO only) ──────────────────────────────────

/**
 * Absolute canonical URL — for <meta>, og:url, sitemap, JSON-LD only.
 * Do NOT use in Next.js <Link href> or <a href> for navigation.
 *
 * Returns: 'https://scardubu.dev/#section-id'
 */
export function canonicalSectionUrl(anchor: string): string {
  return `${SITE_URL}/#${anchor}`
}

// ─── GitHub API proxy ─────────────────────────────────────────────────────────

/**
 * Base path for the server-side GitHub stats proxy.
 * Prevents unauthenticated rate limits (60 req/hr per IP).
 */
export const GITHUB_PROXY_BASE = '/api/github'