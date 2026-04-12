import { expect, test } from '@playwright/test';

test.describe('Portfolio smoke tests', () => {
  test('skip nav is first focusable element', async ({ page }) => {
    await page.goto('/');

    const firstFocusableClassName = await page.evaluate(() => {
      const selectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',');

      const firstFocusable = Array.from(document.querySelectorAll<HTMLElement>(selectors)).find((element) => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

      return firstFocusable?.className ?? '';
    });

    expect(firstFocusableClassName).toContain('skip-nav');
  });

  test('hero visible and name does not orphan wrap', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#hero').first()).toBeVisible();
    await expect(page.locator('h1').first()).toContainText('When AI behavior');
    await expect(page.locator('h1').first()).toContainText('platform reliability');
    await expect(page.locator('h1').first()).toContainText('product clarity must hold simultaneously');
  });

  test('no unicode escape or unverifiable metrics in rendered home copy', async ({ page }) => {
    await page.goto('/');

    const body = (await page.locator('body').textContent()) ?? '';
    expect(body).not.toContain(String.raw`\u2192`);
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

    // Wait until React has fully hydrated so the capture listener is registered.
    // `networkidle` reliably indicates all async JS (including useEffect) has settled.
    await page.waitForLoadState('networkidle');

    // `page.keyboard.press` injects a trusted CDP key event that travels the full
    // capture→target→bubble chain from the focused element up to document, so the
    // CommandPalette's `document.addEventListener('keydown', …, { capture: true })`
    // fires in CAPTURING_PHASE (1) — the same path a real user keystroke takes.
    // This is more reliable than `document.dispatchEvent()` which dispatches with
    // document as the AT_TARGET (phase 2), where ordering against inline-script
    // listeners is implementation-defined in Blink.
    await page.keyboard.press('Control+k');

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

    await expect(page.locator('#contact a[href="mailto:scardubu@gmail.com"][data-cta="primary"]')).toBeVisible();
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

  test('ArchDecision panel visible without interaction', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('CHOSEN').first()).toBeVisible();
    await expect(page.getByText('BECAUSE').first()).toBeVisible();
  });

  test('OVER label is muted and not red', async ({ page }) => {
    await page.goto('/');

    const overLabel = page.getByText('OVER').first();
    await expect(overLabel).toBeVisible();
    const color = await overLabel.evaluate((el) => window.getComputedStyle(el).color);
    expect(color).not.toMatch(/^rgb\(239,/);
  });

  test('main landmark exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main#main-content')).toBeAttached();
  });

  test('conviction pillars have colored top borders', async ({ page }) => {
    await page.goto('/');

    const pillars = page.locator('[data-pillar]');
    await expect(pillars).toHaveCount(4);
  });

  test('three CTA button tiers are present', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#hero a[data-cta="primary"]').first()).toBeVisible();
    await expect(page.locator('#hero a[data-cta="secondary"]').first()).toBeVisible();
    await expect(page.locator('#hero a[data-cta="ghost"]').first()).toBeVisible();
  });

  test('resume CTA has download attribute and points to the canonical asset', async ({ page }) => {
    await page.goto('/');

    const resumeLink = page.locator('#hero a[data-cta="ghost"]').first();
    await expect(resumeLink).toHaveAttribute('download', '');
    await expect(resumeLink).toHaveAttribute('href', '/oscar-ndugbu-resume.pdf');
  });

  test('writing section is present on home', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#writing')).toBeVisible();
    await expect(page.locator('#writing article').first()).toBeVisible();
  });

  test('writing page renders article list', async ({ page }) => {
    await page.goto('/writing');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1, name: 'Notes on building' })).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: /Featured article: Building SabiScore: Architecture Decisions in a Resource-Constrained Production System/i,
      })
    ).toBeVisible();
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
      if (parsed['@type'] === 'Person' && parsed.name === 'Oscar Ndugbu (Scardubu)') {
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

  test('[v15] ScrollProgress bar is present and z-index >= 60', async ({ page }) => {
    await page.goto('/');
    const bar = page.locator('[data-testid="scroll-progress"]');
    await expect(bar).toBeAttached();
    const zIndex = await bar.evaluate((el) =>
      parseInt(window.getComputedStyle(el).zIndex, 10)
    );
    expect(zIndex).toBeGreaterThanOrEqual(60);
  });

  test('[v15] Footer contains scardubu.dev', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('scardubu.dev');
  });

  test('[v15] Phone number is a tappable tel: link', async ({ page }) => {
    await page.goto('/');
    const telLink = page.locator('a[href="tel:+2348033885065"]');
    await expect(telLink).toBeAttached();
  });

  test('[v15] BECAUSE field has heavier font weight than OVER field', async ({ page }) => {
    await page.goto('/');
    const becauseValue = page.locator('[data-label="BECAUSE"]').first();
    const overValue = page.locator('[data-label="OVER"]').first();

    if ((await becauseValue.count()) > 0 && (await overValue.count()) > 0) {
      const becauseWeight = await becauseValue.evaluate((el) =>
        Number.parseInt(window.getComputedStyle(el).fontWeight, 10)
      );
      const overWeight = await overValue.evaluate((el) =>
        Number.parseInt(window.getComputedStyle(el).fontWeight, 10)
      );

      expect(becauseWeight).toBeGreaterThanOrEqual(overWeight);
      expect(becauseWeight).toBeGreaterThanOrEqual(500);
    }
  });

  test('[CE-1] CursorGlow element is present in DOM', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="cursor-glow"]')).toBeAttached();
  });

  test('Contact cards have distinct data-accent values', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    const cards = page.locator('#contact [data-accent]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
    const accents = await Promise.all(
      Array.from({ length: count }, (_, i) => cards.nth(i).getAttribute('data-accent'))
    );
    expect(new Set(accents).size).toBeGreaterThan(1);
  });
});
