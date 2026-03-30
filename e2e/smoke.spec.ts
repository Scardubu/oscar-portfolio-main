import { expect, test } from '@playwright/test';

test.describe('Portfolio smoke tests', () => {
  test('skip nav is first focusable element', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-nav')).toBeFocused();
  });

  test('hero visible and name does not orphan wrap', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('h1').first()).toHaveText('Oscar Scardubu');
  });

  test('no unicode escape or unverifiable metrics in rendered home copy', async ({ page }) => {
    await page.goto('/');

    const body = (await page.locator('body').textContent()) ?? '';
    expect(body).not.toContain('\\u2192');
    expect(body).not.toMatch(/Active users/i);
    expect(body).not.toContain('u2192');
  });

  test('no horizontal overflow at 375px', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();

    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );

    expect(overflow).toBe(false);
    await context.close();
  });

  test('exactly three projects render', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#projects [data-project-id]')).toHaveCount(3);
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

  test('command palette opens and closes from keyboard', async ({ page }) => {
    await page.goto('/');

    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+K`);
    await expect(page.locator('.cmd-panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.cmd-panel')).toBeHidden();
  });

  test('theme toggle switches the data-theme attribute', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('button[aria-label*="Switch to"]').first();
    const before = await page.locator('html').getAttribute('data-theme');

    await toggle.click();

    const after = await page.locator('html').getAttribute('data-theme');
    expect(before).not.toBe(after);
  });

  test('mailto CTA is visible in contact section', async ({ page }) => {
    await page.goto('/');

    await page.locator('#contact').scrollIntoViewIfNeeded();

    await expect(page.locator('#contact a.glass-card[href="mailto:oscar@scardubu.dev"]')).toBeVisible();
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

  test('metric cards render qualitative headings', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('LIVE IN PRODUCTION')).toBeVisible();
    await expect(page.getByText('ZERO-DOWNTIME DESIGN')).toBeVisible();
  });

  test('SabiScore architecture decisions expand', async ({ page }) => {
    await page.goto('/');

    const toggle = page
      .locator('[data-project-id="sabiscore"]')
      .getByRole('button', { name: /architecture decisions/i });

    await toggle.click();

    await expect(page.getByText(/Chose:/i).first()).toBeVisible();
    await expect(page.getByText(/Over:/i).first()).toBeVisible();
    await expect(page.getByText(/Because:/i).first()).toBeVisible();
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

  test('per-project OG image returns PNG', async ({ page }) => {
    const r = await page.request.get('/work/sabiscore/og');
    expect(r.status()).toBe(200);
    expect(r.headers()['content-type']).toContain('image/png');
  });

  test('work slug page renders with reading progress', async ({ page }) => {
    await page.goto('/work/sabiscore');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.reading-progress')).toHaveAttribute('role', 'progressbar');
  });

  test('writing slug page renders with reading progress', async ({ page }) => {
    await page.goto('/writing/building-sabiscore');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.reading-progress')).toHaveAttribute('role', 'progressbar');
  });

  test('JSON-LD person schema is present on home page', async ({ page }) => {
    await page.goto('/');
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();

    let foundPerson = false;

    for (let index = 0; index < count; index += 1) {
      const text = await scripts.nth(index).textContent();
      const parsed = JSON.parse(text ?? '{}') as { ['@type']?: string; name?: string };
      if (parsed['@type'] === 'Person' && parsed.name === 'Oscar Scardubu') {
        foundPerson = true;
      }
    }

    expect(foundPerson).toBe(true);
  });

  test('activity API returns JSON with ago field', async ({ page }) => {
    const response = await page.request.get('/api/activity');
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { ago: string };
    expect(typeof body.ago).toBe('string');
  });
});
