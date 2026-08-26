import { devices, expect, test, type Page } from '@playwright/test';

async function gotoHome(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('load');
}

async function waitForEngine(page: Page, expected: 'lenis' | 'native') {
  await page.waitForFunction(
    (engine) => document.documentElement.dataset.scrollEngine === engine,
    expected,
    { timeout: 8_000 }
  );
}

test.describe('Scroll responsiveness contract', () => {
  test.beforeEach(async ({ browserName }) => {
    if (browserName === 'firefox') test.skip();
  });

  test('[desktop] a wheel gesture advances the document without an interception dead zone', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop fine-pointer contract.');

    await gotoHome(page);
    await waitForEngine(page, 'lenis');

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 700);

    await page.waitForFunction(
      (start) => window.scrollY >= Number(start) + 120,
      before,
      { timeout: 2_500 }
    );

    const after = await page.evaluate(() => window.scrollY);
    expect(after - before).toBeGreaterThanOrEqual(120);
  });

  test('[mobile] coarse-pointer devices keep direct native vertical scrolling', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['Pixel 5'] });
    const page = await context.newPage();

    try {
      await gotoHome(page);
      await waitForEngine(page, 'native');

      await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'auto' }));
      await page.waitForFunction(() => window.scrollY >= 300, undefined, { timeout: 2_000 });

      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(300);
      expect(
        await page.evaluate(() => document.documentElement.dataset.scrollCinemaRuntime)
      ).toBeUndefined();
    } finally {
      await context.close();
    }
  });

  test('[desktop] hash navigation reveals the projects heading below the sticky nav', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop hash-navigation contract.');

    await gotoHome(page);
    await waitForEngine(page, 'lenis');

    await page.locator('nav[aria-label="Primary"]').getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/#section-projects$/);

    await page.waitForFunction(
      () => {
        const target = document.getElementById('section-projects');
        const heading = document.getElementById('projects-heading');
        const nav = document.querySelector<HTMLElement>('.glass-nav');
        if (!target || !heading || !nav) return false;

        const navBottom = nav.getBoundingClientRect().bottom;
        const headingRect = heading.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const upperViewportBoundary = Math.max(navBottom + 24, window.innerHeight * 0.42);

        // The section intentionally has generous top padding for chapter rhythm, so
        // its invisible structural boundary may sit beneath the fixed glass nav.
        // The actual navigation contract is that the destination is in-view and its
        // labelled heading is fully readable below the sticky chrome, near the top
        // of the viewport rather than stranded halfway down the page.
        return (
          targetRect.bottom > navBottom &&
          headingRect.top >= navBottom + 16 &&
          headingRect.bottom <= upperViewportBoundary
        );
      },
      undefined,
      { timeout: 5_000 }
    );
  });
});
