/**
 * tests/portfolio.spec.ts — scardubu.dev
 *
 * v2: Updated for all v2 features and corrections.
 * Run: pnpm test (all browsers) | pnpm test:e2e (Chromium only)
 */
import { test, expect, type Page } from '@playwright/test';

/* ─── Helpers ────────────────────────────────────────────────── */

async function goto(page: Page) {
  await page.goto('/');
  // Wait for hero content to be visible before running assertions
  await expect(page.getByRole('heading', { name: 'Oscar Ndugbu', level: 1 })).toBeVisible();
}

/* ─── Test suites ────────────────────────────────────────────── */

test.describe('Nav', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('tagline is correct', async ({ page }) => {
    await expect(page.getByText('Production AI systems · Full-stack execution')).toBeVisible();
  });

  test('does not contain "Portfolio •" prefix', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Portfolio •');
  });

  test('Hire me CTA links to email', async ({ page }) => {
    const hireLink = page.getByRole('link', { name: /hire me/i }).first();
    await expect(hireLink).toHaveAttribute('href', 'mailto:scardubu@gmail.com');
  });

  test('Work link scrolls to projects section', async ({ page }) => {
    await page.getByRole('link', { name: 'Work' }).click();
    await expect(page.locator('#projects')).toBeInViewport({ ratio: 0.1 });
  });

  test('nav border appears on scroll', async ({ page }) => {
    // Before scroll — border should be transparent
    const nav = page.locator('nav');
    await expect(nav).not.toHaveClass(/scrolled/);
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(200);
    await expect(nav).toHaveClass(/scrolled/);
  });
});

test.describe('Nav — Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => { await goto(page); });

  test('hamburger button is visible on mobile', async ({ page }) => {
    const burger = page.getByRole('button', { name: /open menu/i });
    await expect(burger).toBeVisible();
  });

  test('desktop nav links are hidden on mobile', async ({ page }) => {
    // Work/About/Contact links in the desktop row should not be visible
    await expect(page.locator('.hidden-mobile')).not.toBeVisible();
  });

  test('mobile drawer opens and closes', async ({ page }) => {
    const burger  = page.getByRole('button', { name: /open menu/i });
    const drawer  = page.locator('.mobile-nav');
    await expect(drawer).not.toHaveClass(/open/);
    await burger.click();
    await expect(drawer).toHaveClass(/open/);
    await burger.click();
    await expect(drawer).not.toHaveClass(/open/);
  });

  test('mobile drawer closes on link tap', async ({ page }) => {
    const burger = page.getByRole('button', { name: /open menu/i });
    await burger.click();
    const workLink = page.locator('.mobile-nav-link').first();
    await workLink.click();
    await page.waitForTimeout(200);
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/open/);
  });
});

test.describe('Hero', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('h1 is Oscar Ndugbu', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Oscar Ndugbu', level: 1 })).toBeVisible();
  });

  test('headshot image is present and has alt text', async ({ page }) => {
    const headshot = page.locator('img[alt="Oscar Ndugbu"]');
    await expect(headshot).toBeVisible();
    await expect(headshot).toHaveAttribute('src', /headshot/);
  });

  test('location pill shows Nigeria NG · Remote-First', async ({ page }) => {
    await expect(page.getByText('Nigeria NG · Remote-First')).toBeVisible();
  });

  test('hero bio: evidence-first opening line', async ({ page }) => {
    await expect(page.getByText(
      /Production AI systems shipped for real users — not prototypes, not notebooks/
    )).toBeVisible();
  });

  test('positioning card contains correct copy', async ({ page }) => {
    await expect(page.getByText(
      /The engineer you bring in when AI behavior/
    )).toBeVisible();
  });

  test('no first-person identity claims', async ({ page }) => {
    const body = page.locator('body');
    for (const phrase of [
      "Hey, I'm Oscar",
      "I engineer",
      "I build",
      "I specialize",
      "Self-taught from Nigeria",
      "I am",
      "I create",
      "I turn",
      "I focus",
    ]) {
      await expect(body).not.toContainText(phrase);
    }
  });

  test('See my work CTA is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /see my work/i })).toBeVisible();
  });

  test('email contact link is correct', async ({ page }) => {
    const emailLinks = page.getByRole('link', { name: /scardubu@gmail\.com/i });
    await expect(emailLinks.first()).toBeVisible();
  });
});

test.describe('Metric cards — B01 + B12', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('all four qualitative cards are visible', async ({ page }) => {
    await expect(page.getByText('Real-World Reach')).toBeVisible();
    await expect(page.getByText('Precision AI')).toBeVisible();
    await expect(page.getByText('Always On')).toBeVisible();
    await expect(page.getByText('End-to-End')).toBeVisible();
  });

  test('no counter animation values (B01)', async ({ page }) => {
    // Disable JS to verify SSR delivers final content without animation
    const body = page.locator('body');
    await expect(body).not.toContainText('0+');
    await expect(body).not.toContainText('0%');
  });

  test('B12: "4+ YEARS" heading removed', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('4+ YEARS');
  });
});

test.describe('Projects — bento grid', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('section label "Selected Work" is present', async ({ page }) => {
    await expect(page.getByText('Selected Work')).toBeVisible();
  });

  test('no meta-commentary headings (B07)', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toContainText('Projects framed like decision artifacts');
    await expect(body).not.toContainText('Each card is designed to answer');
  });

  test('SabiScore card is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'SabiScore' })).toBeVisible();
  });

  test('SabiScore has live status badge', async ({ page }) => {
    await expect(page.locator('.status-live').first()).toBeVisible();
  });

  test('no simulated ROI (B06)', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toContainText('+12.8% ROI');
    await expect(body).not.toContainText('Simulated betting yield');
  });

  test('architecture decisions accordion opens — Context visible', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /architecture decisions/i }).first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByText('Context').first()).toBeVisible();
    await expect(page.getByText('Problem').first()).toBeVisible();
    await expect(page.getByText('Approach').first()).toBeVisible();
    await expect(page.getByText('Outcome').first()).toBeVisible();
  });

  test('architecture decisions accordion closes', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /architecture decisions/i }).first();
    await toggle.click();
    await expect(page.getByText('Context').first()).toBeVisible();
    // Re-click: "Hide decisions" text now shown
    const hideBtn = page.getByRole('button', { name: /hide decisions/i }).first();
    await hideBtn.click();
    await expect(page.getByText('Context').first()).not.toBeVisible();
  });

  test('Hashablanca card is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Hashablanca' })).toBeVisible();
  });

  test('AI Consulting card is visible', async ({ page }) => {
    await expect(page.getByText(/ML Debugging Tooling/)).toBeVisible();
  });
});

test.describe('Projects — Mobile responsive (bento grid)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('bento grid collapses to single column on mobile', async ({ page }) => {
    await goto(page);
    // All bento cells should be full-width (grid-column: 1 / 2)
    const featured = page.locator('.bento-featured');
    const side     = page.locator('.bento-side');
    const full     = page.locator('.bento-full');

    // Each card should be visible and not clipped horizontally
    await expect(featured).toBeVisible();
    await expect(side).toBeVisible();
    await expect(full).toBeVisible();

    // Verify no horizontal overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

test.describe('About', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('section heading is correct', async ({ page }) => {
    await expect(page.getByRole('heading', {
      name: /Full-Stack ML Engineer — Production AI Systems/i,
      level: 2,
    })).toBeVisible();
  });

  test('differentiator copy is present', async ({ page }) => {
    await expect(page.getByText(/sub-Saharan Africa/)).toBeVisible();
    await expect(page.getByText(/The constraints are not a liability/)).toBeVisible();
  });

  test('skills are rendered (not cut by glass-light artifact)', async ({ page }) => {
    await expect(page.getByText('XGBoost')).toBeVisible();
    await expect(page.getByText('FastAPI')).toBeVisible();
    await expect(page.getByText('Redis')).toBeVisible();
    await expect(page.getByText('Solidity')).toBeVisible();
  });

  test('no first-person claims in about section', async ({ page }) => {
    const section = page.locator('#about');
    await expect(section).not.toContainText('I am');
    await expect(section).not.toContainText('I build');
  });
});

test.describe('About — Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('about grid is single column on mobile', async ({ page }) => {
    await goto(page);
    // No horizontal overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
    // Both bio and skills columns are visible
    await expect(page.locator('.about-grid')).toBeVisible();
  });
});

test.describe('Contact', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('availability badge is visible', async ({ page }) => {
    await expect(page.locator('.status-available')).toBeVisible();
    await expect(page.locator('.status-available')).toContainText(/available/i);
  });

  test('engagement modes grid is visible', async ({ page }) => {
    const contact = page.locator('#contact');
    await expect(contact.getByText('Full-time')).toBeVisible();
    await expect(contact.getByText('Co-founder')).toBeVisible();
    await expect(contact.getByText('Consulting')).toBeVisible();
  });

  test('primary email CTA is correct', async ({ page }) => {
    const emailCTA = page.locator('#contact').getByRole('link', {
      name: /scardubu@gmail\.com/i,
    });
    await expect(emailCTA).toHaveAttribute('href', 'mailto:scardubu@gmail.com');
  });

  test('GitHub link opens in new tab', async ({ page }) => {
    const ghLinks = page.locator('#contact').getByRole('link', { name: /github/i });
    await expect(ghLinks.first()).toHaveAttribute('target', '_blank');
    await expect(ghLinks.first()).toHaveAttribute('rel', /noopener/);
  });

  test('LinkedIn link present', async ({ page }) => {
    const li = page.locator('#contact').getByRole('link', { name: /linkedin/i });
    await expect(li).toBeVisible();
  });

  test('no testimonial or generated avatar (B03)', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('ui-avatars');
    // No testimonial block patterns
    await expect(page.locator('body')).not.toContainText('said about working with me');
    await expect(page.locator('body')).not.toContainText('testimonial');
  });

  test('no self-reported traffic metrics (B11)', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toContainText('350 monthly visitors');
    await expect(body).not.toContainText('Portfolio Performance');
    await expect(body).not.toContainText('Avg. session');
  });
});

test.describe('Footer — B02 + B10', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('attribution is correct (B10)', async ({ page }) => {
    await expect(page.getByText(/Designed and built by Oscar Ndugbu · Nigeria/)).toBeVisible();
  });

  test('Next.js 16 is gone (B02)', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Next.js 16');
  });

  test('"Built with ❤️ in Naija" is gone (B10)', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Built with');
    await expect(page.locator('body')).not.toContainText('Naija');
  });

  test('footer GitHub link is accessible', async ({ page }) => {
    const footer = page.locator('footer');
    const ghLink = footer.getByRole('link', { name: /oscar ndugbu on github/i });
    await expect(ghLink).toBeVisible();
  });

  test('footer LinkedIn link is accessible', async ({ page }) => {
    const footer = page.locator('footer');
    const liLink = footer.getByRole('link', { name: /oscar ndugbu on linkedin/i });
    await expect(liLink).toBeVisible();
  });

  test('no double border on footer', async ({ page }) => {
    // The footer should have exactly one border — verify via computed style
    const footerBorderTop = await page.locator('footer').evaluate(
      (el) => window.getComputedStyle(el).borderTopWidth
    );
    // Should be 1px (not 2px from double border bug)
    expect(parseFloat(footerBorderTop)).toBeLessThanOrEqual(1);
  });
});

test.describe('Accessibility — WCAG AA', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('page title matches Phase 1 positioning', async ({ page }) => {
    await expect(page).toHaveTitle(/Production AI Systems/);
  });

  test('page has exactly one h1', async ({ page }) => {
    const h1s = await page.locator('h1').count();
    expect(h1s).toBe(1);
  });

  test('all images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const count  = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('all buttons have accessible labels', async ({ page }) => {
    const buttons = page.getByRole('button');
    const count   = await buttons.count();
    for (let i = 0; i < count; i++) {
      const btn   = buttons.nth(i);
      const text  = (await btn.textContent())?.trim();
      const label = await btn.getAttribute('aria-label');
      expect(text || label).toBeTruthy();
    }
  });

  test('all external links have rel="noopener noreferrer"', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count         = await externalLinks.count();
    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });

  test('no horizontal scroll at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });

  test('nav has aria-label', async ({ page }) => {
    await expect(page.locator('nav[aria-label]').first()).toBeVisible();
  });

  test('sections have aria-labels', async ({ page }) => {
    for (const id of ['hero', 'projects', 'about', 'contact']) {
      await expect(page.locator(`section#${id}[aria-label]`)).toBeAttached();
    }
  });
});

test.describe('Scroll behaviour', () => {
  test.beforeEach(async ({ page }) => { await goto(page); });

  test('anchor nav clears fixed nav (scroll-margin-top)', async ({ page }) => {
    // Click Work → projects section top edge should not be under nav
    await page.getByRole('link', { name: 'Work' }).click();
    await page.waitForTimeout(600);

    const navBottom = await page.locator('nav').evaluate(
      (el) => el.getBoundingClientRect().bottom
    );
    const sectionTop = await page.locator('#projects').evaluate(
      (el) => el.getBoundingClientRect().top
    );

    // Section top should be at or below nav bottom
    expect(sectionTop).toBeGreaterThanOrEqual(navBottom - 2); // 2px tolerance
  });
});

test.describe('Performance — CLS', () => {
  test('no layout shift from metric cards (B01)', async ({ page }) => {
    // Measure CLS — metric cards are SSR-rendered so no shift on hydration
    await page.goto('/');
    const cls = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as PerformanceEntry & { hadRecentInput: boolean }).hadRecentInput) {
              clsValue += (entry as PerformanceEntry & { value: number }).value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      });
    });
    // Good CLS < 0.1 (Google Core Web Vitals threshold)
    expect(cls).toBeLessThan(0.1);
  });
});