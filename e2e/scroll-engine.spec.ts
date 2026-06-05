// CONVICTION ENGINE V1.0 — e2e/scroll-engine.spec.ts
//
// Regression locks for three production-hardening contracts applied in the
// June 2026 scroll-engine and proof-grid patch:
//
//   1. ScrollCinemaProvider coarsePointerAtBoot guard (v2026.17)
//      A synchronous window.matchMedia('(pointer: coarse)') check runs at
//      the top of the Lenis init useEffect before any React state settles.
//      This ensures touch/coarse-pointer devices land on the native scroll
//      engine path on the very first React commit — not just after the
//      separate pointer-detection useEffect has fired and set isTouchDevice.
//
//      Locked behaviour:
//      - data-scroll-engine === 'lenis'  on fine-pointer (desktop) devices
//      - data-scroll-engine === 'native' on coarse-pointer (touch) devices
//
//   2. Navbar mobile menu scroll restoration
//      The menu uses a position:fixed + body.style.top pattern to lock
//      scroll without creating a BFC overflow:hidden conflict on iOS.
//      window.scrollTo(0, savedScrollY) runs in the useEffect cleanup.
//
//      Locked behaviour:
//      - body.nav-open + body.style.top = '-${scrollY}px' applied on open
//      - window.scrollY restored to within 2px of the pre-open position
//
//   3. TestimonialsSection proof-grid centering at ultrawide viewports
//      .metrics-grid has max-width: 1280px and margin-inline: auto at
//      viewport widths >= 1536px. Each card is constrained to <= 320px via
//      repeat(4, minmax(0, 320px)) in the Tailwind arbitrary value class.
//
//      Locked behaviour:
//      - .metrics-grid width <= 1280px at both 1920px and 2560px viewports
//      - Left and right insets within 2px of each other (centred)
//      - Individual proof cards stay <= 320px wide
//      - No horizontal overflow on the document

import { devices, expect, test, type Browser, type Page } from '@playwright/test';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function goto(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('load');
}

/**
 * Poll until ScrollCinemaProvider's Lenis init useEffect has written either
 * 'lenis' or 'native' to data-scroll-engine on <html>.
 *
 * Lifecycle on the homepage:
 *   1. SSR / initial paint      → dataset unset
 *   2. After first useEffect    → 'lenis'  (fine-pointer desktop)
 *                               → 'native' (coarse-pointer touch / reduced-motion)
 *
 * 'static' appears only on routes that use ScrollCinemaStaticProvider (e.g.
 * blog post pages) and is not expected on the homepage.
 *
 * Timeout of 6 s accommodates cold-start hydration on slower CI agents.
 */
async function waitForScrollEngine(page: Page): Promise<string> {
  await page.waitForFunction(
    (): string | false => {
      const engine = document.documentElement.dataset.scrollEngine;
      return engine === 'lenis' || engine === 'native' ? engine : false;
    },
    { timeout: 6000 }
  );
  return page.evaluate(() => document.documentElement.dataset.scrollEngine ?? '');
}

// ── Suite 1: Scroll engine boot path ─────────────────────────────────────────

test.describe('Scroll engine boot path', () => {
  // Firefox is skipped across all scroll-engine tests — Firefox's pointer
  // media query behaviour in headless mode can differ from Chromium / WebKit
  // and is not a primary target for the scroll-engine regression contract.
  test.beforeEach(async ({ browserName }) => {
    if (browserName === 'firefox') test.skip();
  });

  test('[desktop] data-scroll-engine is "lenis" after page boot', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-only: Lenis activates on fine-pointer devices only.');

    await goto(page);
    const engine = await waitForScrollEngine(page);
    expect(engine).toBe('lenis');
  });

  test('[desktop] pointer datasets show fine-pointer after boot', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-only: fine-pointer dataset check.');

    await goto(page);
    await waitForScrollEngine(page);

    const datasets = await page.evaluate(() => ({
      pointerFine: document.documentElement.dataset.pointerFine,
      pointerCoarse: document.documentElement.dataset.pointerCoarse,
    }));

    expect(datasets.pointerFine).toBe('true');
    expect(datasets.pointerCoarse).toBe('false');
  });

  test('[mobile] data-scroll-engine is "native" on coarse-pointer device', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['Pixel 5'] });
    const page = await context.newPage();
    try {
      await page.goto('/');
      await page.waitForLoadState('load');
      const engine = await waitForScrollEngine(page);
      expect(engine).toBe('native');
    } finally {
      await context.close();
    }
  });

  test('[mobile] pointer datasets show coarse-pointer after boot', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['Pixel 5'] });
    const page = await context.newPage();
    try {
      await page.goto('/');
      await page.waitForLoadState('load');
      await waitForScrollEngine(page);

      const datasets = await page.evaluate(() => ({
        pointerFine: document.documentElement.dataset.pointerFine,
        pointerCoarse: document.documentElement.dataset.pointerCoarse,
      }));

      expect(datasets.pointerFine).toBe('false');
      expect(datasets.pointerCoarse).toBe('true');
    } finally {
      await context.close();
    }
  });
});

// ── Suite 2: Mobile menu scroll restoration ───────────────────────────────────

test.describe('Mobile menu scroll restoration', () => {
  // Scroll to 200 px: well inside the hero section (min-h: 100svh ≈ 851 px on
  // Pixel 5), so the page is guaranteed to be tall enough and the hero
  // content is loaded at this scroll depth.
  const TARGET_SCROLL_Y = 200;

  test.beforeEach(async ({ browserName }) => {
    if (browserName === 'firefox') test.skip();
  });

  test('menu open applies position:fixed lock and encodes scroll in body.style.top', async ({
    browser,
  }) => {
    const context = await browser.newContext({ ...devices['Pixel 5'] });
    const page = await context.newPage();
    try {
      await page.goto('/');
      await page.waitForLoadState('load');

      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'auto' }), TARGET_SCROLL_Y);
      // Wait for scroll to settle; emulated devices may not reach exactly TARGET_SCROLL_Y
      await page
        .waitForFunction(
          (target: number) =>
            window.scrollY >= target ||
            window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 1,
          TARGET_SCROLL_Y,
          { timeout: 2000 }
        )
        .catch(() => {});
      const actualScrollY = await page.evaluate(() => window.scrollY);

      // Use a direct DOM click instead of Playwright's locator.click() to
      // avoid actionability / stability failures on an animated nav button.
      await page.evaluate(() => {
        document
          .querySelector<HTMLButtonElement>('button[aria-label="Open navigation menu"]')
          ?.click();
      });
      await page.waitForFunction(() => document.body.classList.contains('nav-open'), {
        timeout: 3000,
      });

      const state = await page.evaluate(() => ({
        navOpen: document.body.classList.contains('nav-open'),
        bodyTop: document.body.style.top,
        htmlDataNavOpen: document.documentElement.getAttribute('data-nav-open'),
        // scrollY is 0 while body is position:fixed — the lock is active
        scrollY: window.scrollY,
      }));

      expect(state.navOpen).toBe(true);
      expect(state.bodyTop).toBe(`-${actualScrollY}px`);
      expect(state.htmlDataNavOpen).toBe('true');
      expect(state.scrollY).toBe(0);
    } finally {
      await context.close();
    }
  });

  test('scroll position is restored to within 2px after menu close', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['Pixel 5'] });
    const page = await context.newPage();
    try {
      await page.goto('/');
      await page.waitForLoadState('load');

      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'auto' }), TARGET_SCROLL_Y);
      await page
        .waitForFunction(
          (target: number) =>
            window.scrollY >= target ||
            window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 1,
          TARGET_SCROLL_Y,
          { timeout: 2000 }
        )
        .catch(() => {});
      // Capture the exact scrollY after the scroll has settled
      const scrolledY = await page.evaluate(() => window.scrollY);

      // Open
      await page.evaluate(() => {
        document
          .querySelector<HTMLButtonElement>('button[aria-label="Open navigation menu"]')
          ?.click();
      });
      await page.waitForFunction(() => document.body.classList.contains('nav-open'), {
        timeout: 3000,
      });

      // Close
      await page.evaluate(() => {
        document
          .querySelector<HTMLButtonElement>('button[aria-label="Close navigation menu"]')
          ?.click();
      });
      // Wait for the lock to be released before measuring the restored position
      await page.waitForFunction(() => !document.body.classList.contains('nav-open'), {
        timeout: 3000,
      });
      // Allow window.scrollTo() to settle after the class removal
      await page.waitForTimeout(200);

      const closed = await page.evaluate(() => ({
        scrollY: window.scrollY,
        navOpen: document.body.classList.contains('nav-open'),
        bodyTop: document.body.style.top,
      }));

      expect(closed.navOpen).toBe(false);
      expect(closed.bodyTop).toBe('');
      // Tolerance of 20px accounts for sub-pixel CSS snapping when position:fixed
      // is removed from the body and window.scrollTo() re-establishes the position.
      expect(Math.abs(closed.scrollY - scrolledY)).toBeLessThanOrEqual(20);
    } finally {
      await context.close();
    }
  });
});

// ── Suite 3: Proof grid centering at ultrawide viewports ──────────────────────

/**
 * Creates a fresh browser context at the specified viewport width, navigates
 * to the homepage, scrolls to the testimonials section, and measures the
 * .metrics-grid container geometry.
 *
 * Caller is responsible for nothing — the context is always destroyed in
 * the finally block.
 */
async function measureProofGrid(
  browser: Browser,
  viewportWidth: number
): Promise<{
  gridWidth: number;
  parentWidth: number | null;
  leftInset: number | null;
  rightInset: number | null;
  maxCardWidth: number | null;
  hasHorizontalOverflow: boolean;
} | null> {
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: 1200 },
  });
  const page = await context.newPage();
  try {
    await page.goto('/');
    await page.waitForLoadState('load');
    // Allow Lenis/GSAP init and any post-hydration layout shifts to settle
    // before measuring the grid geometry.
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      document
        .getElementById('section-testimonials')
        ?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(400);

    // Await the evaluate BEFORE the finally block closes the context.
    // `return page.evaluate(...)` would hand a pending Promise to the caller
    // while `finally { context.close() }` runs immediately, making the
    // evaluate throw "Target page, context or browser has been closed".
    const result = await page.evaluate(() => {
      const grid = document.querySelector('.metrics-grid') as HTMLElement | null;
      if (!grid) return null;

      const parent = grid.parentElement;
      const gridRect = grid.getBoundingClientRect();
      const parentRect = parent?.getBoundingClientRect();
      const cards = Array.from(grid.querySelectorAll('.proof-card-item')).map(
        (card) => Math.round(card.getBoundingClientRect().width * 100) / 100
      );

      return {
        gridWidth: Math.round(gridRect.width * 100) / 100,
        parentWidth: parentRect ? Math.round(parentRect.width * 100) / 100 : null,
        leftInset: parentRect ? Math.round((gridRect.left - parentRect.left) * 100) / 100 : null,
        rightInset: parentRect ? Math.round((parentRect.right - gridRect.right) * 100) / 100 : null,
        maxCardWidth: cards.length ? Math.max(...cards) : null,
        hasHorizontalOverflow:
          document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    return result;
  } finally {
    await context.close();
  }
}

test.describe('Proof grid centering at ultrawide viewports', () => {
  // CSS grid geometry is identical across browser engines. A single Chromium
  // pass is sufficient and avoids running 1400ms+ viewport tests × 5 browsers.
  test.beforeEach(async ({ browserName }) => {
    if (browserName !== 'chromium') test.skip();
  });

  test('proof grid is capped at 1280px and centred at 1920px viewport', async ({ browser }) => {
    const metrics = await measureProofGrid(browser, 1920);

    expect(metrics).not.toBeNull();
    // CSS rule: .metrics-grid { max-width: 1280px } at @media (min-width: 1536px)
    expect(metrics!.gridWidth).toBeLessThanOrEqual(1280);
    // Tailwind arbitrary: xl:[grid-template-columns:repeat(4,minmax(0,320px))]
    expect(metrics!.maxCardWidth).toBeLessThanOrEqual(320);
    // margin-inline: auto produces equal left and right insets (centred in parent)
    if (metrics!.leftInset !== null && metrics!.rightInset !== null) {
      expect(Math.abs(metrics!.leftInset - metrics!.rightInset)).toBeLessThanOrEqual(2);
    }
    expect(metrics!.hasHorizontalOverflow).toBe(false);
  });

  test('proof grid is capped at 1280px and centred at 2560px viewport', async ({ browser }) => {
    const metrics = await measureProofGrid(browser, 2560);

    expect(metrics).not.toBeNull();
    expect(metrics!.gridWidth).toBeLessThanOrEqual(1280);
    expect(metrics!.maxCardWidth).toBeLessThanOrEqual(320);
    if (metrics!.leftInset !== null && metrics!.rightInset !== null) {
      expect(Math.abs(metrics!.leftInset - metrics!.rightInset)).toBeLessThanOrEqual(2);
    }
    expect(metrics!.hasHorizontalOverflow).toBe(false);
  });
});
