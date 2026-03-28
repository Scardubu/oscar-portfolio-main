import { expect, test } from '@playwright/test';

test.describe('Portfolio smoke tests', () => {
  test('hero visible + no horizontal overflow', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#hero')).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(page.viewportSize()?.width ?? 375);
  });

  test('exactly three projects render', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('[data-project-id]')).toHaveCount(3);
  });

  test('nav link scrolls to projects section', async ({ page }) => {
    await page.goto('/');

    const mobileToggle = page.getByRole('button', { name: /toggle navigation/i });
    if (await mobileToggle.isVisible()) {
      await mobileToggle.click();
    }

    await page.getByRole('link', { name: 'Projects', exact: true }).click();

    await expect(page.locator('#projects')).toBeInViewport();
  });

  test('mailto CTA is visible in contact section', async ({ page }) => {
    await page.goto('/');

    await page.locator('#contact').scrollIntoViewIfNeeded();

    await expect(page.locator('a[href^="mailto:"]')).toBeVisible();
  });

  test('all target="_blank" links include noopener and noreferrer', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a[target="_blank"]');
    const count = await links.count();

    for (let index = 0; index < count; index += 1) {
      const rel = await links.nth(index).getAttribute('rel');

      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });

  test('no overflow at 375px viewport', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();

    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );

    expect(overflow).toBe(false);

    await context.close();
  });

  test('metric cards render qualitative headings', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('REAL-WORLD REACH')).toBeVisible();
    await expect(page.getByText('ALWAYS ON')).toBeVisible();
  });

  test('SabiScore architecture decisions expand', async ({ page }) => {
    await page.goto('/');

    const toggle = page
      .locator('[data-project-id="sabiscore"]')
      .getByRole('button', { name: /architecture decisions/i });

    await toggle.click();

    await expect(
      page.getByText(/Redis caching after Postgres latency exceeded 200ms at peak/i)
    ).toBeVisible();
  });

  test('skip nav is first focusable element', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-nav')).toBeFocused();
  });

  test('writing page renders article list', async ({ page }) => {
    await page.goto('/writing');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('sitemap returns 200', async ({ page }) => {
    const r = await page.request.get('/sitemap.xml');
    expect(r.status()).toBe(200);
  });

  test('OG image returns PNG', async ({ page }) => {
    const r = await page.request.get('/og');
    expect(r.status()).toBe(200);
    expect(r.headers()['content-type']).toContain('image/png');
  });

  test('work slug page renders', async ({ page }) => {
    await page.goto('/work/sabiscore');
    await expect(page.locator('h1')).toBeVisible();
  });
});
