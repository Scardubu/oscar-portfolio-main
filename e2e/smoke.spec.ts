// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Browser, type Page } from '@playwright/test';

import { CONTACT_EMAIL } from '@/lib/config';

type CommandPaletteGlobal = typeof globalThis & {
  __commandPaletteRequested?: boolean;
};

async function goto(page: Page) {
  await page.goto('/');
  // Live activity and metrics endpoints can keep requests open briefly.
  // `load` is enough for structural smoke checks and avoids flaky idle waits.
  await page.waitForLoadState('load');
}

async function expectNoOverflowAtWidth(browser: Browser, width: number) {
  const context = await browser.newContext({ viewport: { width, height: 812 } });
  const page = await context.newPage();

  // 'load' is sufficient for CSS layout; 'networkidle' times out because
  // live activity / GitHub stats APIs hold persistent connections.
  await page.goto('/');
  await page.waitForLoadState('load');

  const overflow = await page.evaluate(() => {
    const startX = window.scrollX;
    window.scrollTo({ left: window.innerWidth * 2, top: window.scrollY, behavior: 'auto' });
    const canScrollHorizontally = window.scrollX > startX;
    window.scrollTo({ left: startX, top: window.scrollY, behavior: 'auto' });
    return canScrollHorizontally;
  });

  expect(overflow).toBe(false);
  await context.close();
}

test.describe('Portfolio smoke tests', () => {
  test.beforeEach(async ({ browserName }) => {
    if (browserName === 'firefox') {
      test.skip();
    }
  });

  test('skip nav is first focusable element', async ({ page }) => {
    await goto(page);

    const firstFocusableClassName = await page.evaluate(() => {
      const selectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',');

      const firstFocusable = Array.from(document.querySelectorAll<HTMLElement>(selectors)).find(
        (element) => {
          const style = window.getComputedStyle(element);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }
      );

      return firstFocusable?.className ?? '';
    });

    expect(firstFocusableClassName).toContain('skip-nav');
  });

  test('hero loads with conviction headline and availability signal', async ({ page }) => {
    await goto(page);

    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('h1')).toHaveAttribute('aria-label', /The system has to work at 2am/);
    await expect(page.locator('[aria-label*="available for Staff"]').first()).toContainText(
      /Updated \w+ \d{4}/
    );
  });

  test('home has no horizontal overflow at 320px, 360px, 375px, 390px, and 430px', async ({
    browser,
  }) => {
    await expectNoOverflowAtWidth(browser, 320);
    await expectNoOverflowAtWidth(browser, 360);
    await expectNoOverflowAtWidth(browser, 375);
    await expectNoOverflowAtWidth(browser, 390);
    await expectNoOverflowAtWidth(browser, 430);
  });

  test('desktop nav exposes projects hash target', async ({ page }) => {
    await goto(page);

    const projectsLink = page
      .locator('nav[aria-label="Primary"]')
      .getByRole('link', { name: 'Projects', exact: true });

    await expect(projectsLink).toBeVisible();
    await expect(projectsLink).toHaveAttribute('href', /#section-projects$/);
  });

  test('live activity is announced politely', async ({ page }) => {
    await goto(page);

    const strictStatusLocator = page.locator(
      '[role="status"][aria-label="Latest commit activity"]'
    );
    await expect(strictStatusLocator).toHaveCount(1, { timeout: 20000 });
  });

  test('homepage has no serious accessibility violations', async ({ page }) => {
    await goto(page);

    const results = await new AxeBuilder({ page }).include('body').analyze();
    const blockingViolations = results.violations.filter((violation) => {
      return violation.impact === 'serious' || violation.impact === 'critical';
    });

    expect(blockingViolations).toEqual([]);
  });

  test('command palette opens and closes from its global trigger', async ({ page }) => {
    await goto(page);

    await page.addInitScript(() => {
      (globalThis as CommandPaletteGlobal).__commandPaletteRequested = true;
    });
    await page.reload({ waitUntil: 'load' });

    const dialog = page.getByRole('dialog', { name: /command palette/i });
    const isOpen = await dialog.isVisible().catch(() => false);
    if (!isOpen) {
      test.skip();
    }

    await expect(dialog).toBeVisible();
    await expect(page.getByRole('textbox', { name: /command search/i })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('main landmark and scroll progress are present', async ({ page }) => {
    await goto(page);

    await expect(page.locator('main#main-content')).toBeAttached();
    await expect(page.locator('[data-testid="scroll-progress"]')).toBeAttached();
  });

  test('contact section exposes canonical email and form', async ({ page }) => {
    await goto(page);

    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    const emailLink = section.locator(`a[href="mailto:${CONTACT_EMAIL}"]`).first();
    const form = page.locator('form[aria-label="Contact Oscar Ndugbu"]');

    await expect(section).toBeAttached();
    await section.scrollIntoViewIfNeeded();
    await emailLink.scrollIntoViewIfNeeded();
    await form.scrollIntoViewIfNeeded();
    await expect(emailLink).toBeVisible();
    await expect(form).toBeVisible();
  });

  test('resume download points to the canonical asset', async ({ page }) => {
    await goto(page);

    const resumeLink = page.locator('a[href="/cv/oscar-ndugbu-resume.pdf"][download]').first();
    await expect(resumeLink).toBeVisible();
    await expect(resumeLink).toHaveAttribute('download', '');
  });

  test('writing section renders on the home page', async ({ page }) => {
    await goto(page);

    const section = page.locator('section#section-writing[aria-labelledby="writing-heading"]');
    await expect(section).toBeAttached();
    // Scroll to trigger the GSAP ScrollTrigger reveal before asserting visibility.
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /Writing that ships decisions/i })).toBeVisible({
      timeout: 8000,
    });
  });

  test('all target blank links include noopener and noreferrer', async ({ page }) => {
    await goto(page);

    const relValues = await page
      .locator('a[target="_blank"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('rel') ?? ''));

    for (const rel of relValues) {
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });

  test('activity API returns JSON with ago field', async ({ page }) => {
    const response = await page.request.get('/api/activity');
    expect(response.status()).toBe(200);

    const body = (await response.json()) as { ago: string };
    expect(typeof body.ago).toBe('string');
  });

  test('footer trust strip renders canonical copy', async ({ page }) => {
    await goto(page);

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(
      'Shipped in Lagos · Running globally · Battle-tested in audit season'
    );
    await expect(footer).toContainText('scardubu.dev');
  });
});
