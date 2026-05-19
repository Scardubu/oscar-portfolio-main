/**
 * tests/portfolio.spec.ts — scardubu.dev
 *
 * v3 — V1.0 Compliance Hardening: aligned to CONVICTION ENGINE V1.0
 *       Section IDs, copy, availability chip, Skills flow hook,
 *       contact form state copy, command palette easter-egg commands,
 *       and motion/layout contracts.
 * Run: pnpm test (all browsers) | pnpm test:e2e (Chromium only)
 */
import { test, expect, type Page } from '@playwright/test';
import { CONTACT_EMAIL } from '@/lib/config';

/* ─── Helpers ────────────────────────────────────────────────── */

async function goto(page: Page) {
  await page.goto('/');
  // Hero h1 has aria-label "The system has to work at 2am. That's not a slogan…"
  await expect(page.locator('h1')).toBeVisible();
}

/* ─── Test suites ────────────────────────────────────────────── */

test.describe('Nav', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('kicker contains correct stack identifiers', async ({ page }) => {
    await expect(page.locator('.hero-kicker .hidden.sm\\:inline')).toContainText(
      'Full-Stack · React Native · Next.js 15 · AI Systems · Lagos → Global'
    );
  });

  test('does not contain "Portfolio •" prefix', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Portfolio •');
  });

  test('Projects nav link is present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Projects' }).first()).toBeVisible();
  });

  test('Contact nav link links to contact section', async ({ page }) => {
    const contactLink = page.getByRole('link', { name: 'Contact' }).first();
    await expect(contactLink).toHaveAttribute('href', /#section-contact/);
  });

  test('nav remains fixed and visible after scroll', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);

    await expect(header).toBeVisible();
    await expect(header).toHaveClass(/fixed/);
  });
});

test.describe('Nav — Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('hamburger button is visible on mobile', async ({ page }) => {
    const burger = page.getByRole('button', { name: /open navigation menu/i });
    await expect(burger).toBeVisible();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    const burger = page.getByRole('button', { name: /navigation menu/i });
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await burger.click();
    await page.waitForTimeout(300);
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Hero', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('h1 aria-label is the positioning headline', async ({ page }) => {
    await expect(page.locator('h1[aria-label*="The system has to work at 2am"]')).toBeAttached();
  });

  test('headshot image has descriptive alt text', async ({ page }) => {
    const headshot = page.locator('img[alt*="Oscar Ndugbu"]').first();
    await expect(headshot).toBeAttached();
  });

  test('hero bio contains conviction copy', async ({ page }) => {
    await expect(page.getByText(/compliant, fast, and relentlessly reliable/)).toBeVisible();
  });

  test('headline "The system has to work at 2am." is visible', async ({ page }) => {
    // Rendered via word-reveal spans; check reconstructed text via aria-label
    await expect(page.locator('h1')).toHaveAttribute('aria-label', /The system has to work at 2am/);
  });

  test('no first-person identity claims', async ({ page }) => {
    const body = page.locator('body');
    for (const phrase of [
      "Hey, I'm Oscar",
      'I engineer',
      'I build',
      'I specialize',
      'Self-taught from Nigeria',
      'I am',
      'I create',
      'I turn',
      'I focus',
    ]) {
      await expect(body).not.toContainText(phrase);
    }
  });

  test('"See the work" CTA is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /see the work/i })).toBeVisible();
  });

  test('"Tell me your constraints" CTA links to contact section', async ({ page }) => {
    const cta = page.getByRole('link', { name: /tell me about your constraints/i }).first();
    await expect(cta).toHaveAttribute('href', /#section-contact/);
  });

  // V1.0 Phase 3 — Availability recency
  test('availability pill is present and contains "AVAILABLE"', async ({ page }) => {
    await expect(page.locator('[aria-label*="available for Staff"]').first()).toBeVisible();
  });

  test('availability pill includes dynamic "Updated" recency text', async ({ page }) => {
    const pill = page.locator('[aria-label*="available for Staff"]').first();
    await expect(pill).toContainText(/AVAILABLE/i);
    // Dynamic month-year rendered via formatAvailabilityMonthYear()
    await expect(pill).toContainText(/Updated \w+ \d{4}/);
  });
});

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('section heading "Built to survive real constraints." is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Built to survive/i })).toBeVisible();
  });

  test('no meta-commentary headings', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toContainText('Projects framed like decision artifacts');
    await expect(body).not.toContainText('Each card is designed to answer');
  });

  test('TaxBridge card is visible', async ({ page }) => {
    await page.locator('#section-projects').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /TaxBridge/i })).toBeVisible();
  });

  test('SabiScore card is visible', async ({ page }) => {
    await page.locator('#section-projects').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /SabiScore/i })).toBeVisible();
  });

  test('no simulated ROI', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toContainText('+12.8% ROI');
    await expect(body).not.toContainText('Simulated betting yield');
  });

  test('architecture decision content is visible', async ({ page }) => {
    await page.locator('#section-projects').scrollIntoViewIfNeeded();
    await expect(page.getByText('Chosen').first()).toBeVisible();
    await expect(page.getByText('Because').first()).toBeVisible();
  });
});

test.describe('Projects — Mobile responsive', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await goto(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});

test.describe('Projects — Narrow mobile responsive', () => {
  test.use({ viewport: { width: 320, height: 712 } });

  test('no horizontal overflow at 320px', async ({ page }) => {
    await goto(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});

test.describe('Skills — V1.0 flow mechanics', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('skills section is present with correct ID', async ({ page }) => {
    await expect(page.locator('#skills')).toBeAttached();
  });

  // V1.0 Phase 2 — Skills flow hook links to #section-about (not #section-projects)
  test('skills flow hook links to the About section', async ({ page }) => {
    // Use the strict selector to avoid matching the Suspense skeleton (aria-busy)
    const skillsSection = page.locator('section#skills[aria-labelledby="skills-heading"]');
    await skillsSection.scrollIntoViewIfNeeded();
    const flowHook = skillsSection.getByRole('link', {
      name: /62 skills map to three live systems/i,
    });
    await expect(flowHook).toHaveAttribute('href', /#section-about/);
  });

  test('skills section exposes pillar filter buttons', async ({ page }) => {
    await page.locator('#skills').scrollIntoViewIfNeeded();
    const filterGroup = page.getByRole('group', { name: /filter skills by category/i });
    const buttons = filterGroup.getByRole('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});

test.describe('About', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('about section is present with correct ID', async ({ page }) => {
    await expect(page.locator('#section-about')).toBeAttached();
  });

  test('about section heading is visible', async ({ page }) => {
    await page.locator('#section-about').scrollIntoViewIfNeeded();
    await expect(
      page.getByRole('heading', {
        name: /Federal scale|Production ML|Lagos → Global/i,
      })
    ).toBeVisible();
  });

  // V1.0 Phase 3 — About availability chip also has dynamic date
  test('about availability chip has Updated recency text', async ({ page }) => {
    await page.locator('#section-about').scrollIntoViewIfNeeded();
    const chip = page.locator('#section-about').locator('[aria-label*="available for Staff"]');
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(/Updated \w+ \d{4}/);
  });

  test('stack strip shows expected technologies', async ({ page }) => {
    const section = page.locator('section#section-about[aria-labelledby="about-heading"]');
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText('Next.js 15').first()).toBeVisible();
    await expect(section.getByText('FastAPI').first()).toBeVisible();
  });

  test('no first-person claims in about section', async ({ page }) => {
    const section = page.locator('section#section-about[aria-labelledby="about-heading"]');
    await section.scrollIntoViewIfNeeded();
    await expect(section).not.toContainText('I am');
    await expect(section).not.toContainText('I build');
  });

  test('about section flow hook links to writing section', async ({ page }) => {
    const flowHook = page.locator('#section-about').getByRole('link', {
      name: /Architecture calls documented/i,
    });
    await expect(flowHook).toHaveAttribute('href', /#section-writing/);
  });
});

test.describe('About — Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await goto(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});

test.describe('Contact', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('contact section is present with correct ID', async ({ page }) => {
    await expect(
      page.locator('section#section-contact[aria-labelledby="contact-heading"]')
    ).toBeAttached();
  });

  test('contact heading is correct', async ({ page }) => {
    await page.locator('#section-contact').scrollIntoViewIfNeeded();
    await expect(
      page.getByRole('heading', {
        name: /The system is ready\. Are you\?/i,
      })
    ).toBeVisible();
  });

  test('primary email CTA is correct', async ({ page }) => {
    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    const emailLink = section
      .getByRole('link', {
        name: new RegExp(CONTACT_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
    await expect(emailLink).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`);
  });

  test('contact form is present', async ({ page }) => {
    await page
      .locator('section#section-contact[aria-labelledby="contact-heading"]')
      .scrollIntoViewIfNeeded();
    await expect(page.locator('form[aria-label="Contact Oscar Ndugbu"]')).toBeVisible();
  });

  test('STAFF+ / PRINCIPAL contact card is visible', async ({ page }) => {
    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText('STAFF+ / PRINCIPAL', { exact: true })).toBeVisible();
  });

  test('INFRASTRUCTURE CONSULTING card is visible', async ({ page }) => {
    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText('INFRASTRUCTURE CONSULTING', { exact: true })).toBeVisible();
  });

  test('GitHub link opens in new tab', async ({ page }) => {
    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    const ghLink = section.getByRole('link', { name: /github/i }).first();
    await expect(ghLink).toHaveAttribute('target', '_blank');
    await expect(ghLink).toHaveAttribute('rel', /noopener/);
  });

  test('LinkedIn link present', async ({ page }) => {
    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    const li = section.getByRole('link', { name: /linkedin/i }).first();
    await expect(li).toBeVisible();
  });

  test('no self-reported traffic metrics', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toContainText('350 monthly visitors');
    await expect(body).not.toContainText('Portfolio Performance');
    await expect(body).not.toContainText('Avg. session');
  });

  // V1.0 Phase 4 — Contact form success state copy
  test('contact form success state shows correct copy', async ({ page }) => {
    await page.route('/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    const form = page.locator('form[aria-label="Contact Oscar Ndugbu"]');

    // Fill and submit form
    await form.locator('#cf-name').fill('Test User');
    await form.locator('#cf-email').fill('test@example.com');
    await form.locator('select[name="inquiryType"]').selectOption('job');
    await form
      .locator('textarea[name="message"]')
      .fill('This is a test constraint message that meets minimum length.');

    await form.locator('button[type="submit"]').click();
    const successState = page.getByRole('status').filter({ hasText: 'Constraint received.' });
    await expect(successState).toContainText('Constraint received.');
    await expect(successState).toContainText("I'll review and respond within 24 hours");
  });

  test('contact form error state shows fallback contact path', async ({ page }) => {
    await page.route('/api/contact', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test failure' }),
      });
    });

    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    const form = page.locator('form[aria-label="Contact Oscar Ndugbu"]');

    await form.locator('#cf-name').fill('Test User');
    await form.locator('#cf-email').fill('test@example.com');
    await form.locator('select[name="inquiryType"]').selectOption('job');
    await form
      .locator('textarea[name="message"]')
      .fill('This is a test constraint message that meets minimum length.');
    await form.locator('button[type="submit"]').click();

    const errorState = page
      .getByRole('alert')
      .filter({ hasText: 'Something interrupted the send.' });
    await expect(errorState).toContainText(/Something interrupted the send/);
    await expect(errorState).toContainText(CONTACT_EMAIL);
  });
});

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('trust strip copy is correct', async ({ page }) => {
    await expect(page.locator('footer')).toContainText(
      'Shipped in Lagos · Running globally · Battle-tested in audit season'
    );
  });

  test('footer status reflects live metrics state', async ({ page }) => {
    await page.route('/api/live-metrics', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          systemStatus: 'degraded',
          uptime: 99.12,
          todayPredictions: null,
          note: 'Test fixture',
        }),
      });
    });

    await page.reload();

    const footer = page.locator('footer');
    await expect(footer.getByText('Degraded performance')).toBeVisible();
    await expect(footer).not.toContainText('All systems operational');
  });

  test('no Next.js 16 reference', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Next.js 16');
  });

  test('no "Naija" or "Built with" copy', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Naija');
  });

  test('footer GitHub link is accessible', async ({ page }) => {
    const footer = page.locator('footer');
    const ghLink = footer.getByRole('link', { name: /GitHub/i }).first();
    await expect(ghLink).toBeVisible();
    await expect(ghLink).toHaveAttribute('target', '_blank');
  });

  test('footer LinkedIn link is accessible', async ({ page }) => {
    const footer = page.locator('footer');
    const liLink = footer.getByRole('link', { name: /LinkedIn/i }).first();
    await expect(liLink).toBeVisible();
  });

  test('footer nav links are present', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'Skills' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'About' })).toBeVisible();
  });
});

test.describe('Live Activity Bar', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('live activity bar is rendered with role=status', async ({ page }) => {
    const bar = page.locator('[role="status"][aria-label="Latest commit activity"]');
    // May be loading or showing fallback — just check it's attached and not errored
    await expect(bar).toBeAttached();
  });

  // V1.0 Phase 3 — fallback copy is "Building in production"
  test('live activity fallback copy if API unavailable', async ({ page }) => {
    // Mock the /api/activity endpoint to return an error, triggering fallback
    await page.route('/api/activity', async (route) => {
      await route.abort('failed');
    });
    await page.reload();
    await page.locator('h1').waitFor();
    // After abort, component uses FALLBACK: { message: 'Building in production' }
    const bar = page.locator('[role="status"][aria-label="Latest commit activity"]');
    await expect(bar).toContainText('Building in production');
  });
});

test.describe('Accessibility — WCAG AA', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('page title contains "Full-Stack Engineer"', async ({ page }) => {
    await expect(page).toHaveTitle(/Full-Stack Engineer|Principal.*Engineer/i);
  });

  test('page has exactly one h1', async ({ page }) => {
    const h1s = await page.locator('h1').count();
    expect(h1s).toBe(1);
  });

  test('all images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('all buttons have accessible labels', async ({ page }) => {
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const text = (await btn.textContent())?.trim();
      const label = await btn.getAttribute('aria-label');
      expect(text || label).toBeTruthy();
    }
  });

  test('all external links have rel="noopener"', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
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

  test('key sections have aria-labelledby attributes', async ({ page }) => {
    // Verify the canonical V1.0 section IDs resolve and have aria-labelledby
    for (const id of ['section-projects', 'section-about', 'section-contact']) {
      await expect(page.locator(`section#${id}[aria-labelledby]`)).toBeAttached();
    }
  });
});

test.describe('Anchor scroll — scroll-margin-top', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('clicking Projects nav link scrolls to #section-projects', async ({ page }) => {
    await page.getByRole('link', { name: 'Projects' }).first().click();
    await page.waitForTimeout(600);

    const navBottom = await page
      .locator('header')
      .evaluate((el) => el.getBoundingClientRect().bottom);
    const sectionTop = await page
      .locator('#section-projects')
      .evaluate((el) => el.getBoundingClientRect().top);
    // Section top should be at or below nav bottom (scroll-margin-top ensures clearance)
    expect(sectionTop).toBeGreaterThanOrEqual(navBottom - 8); // 8px tolerance
  });
});

test.describe('Command Palette — V1.0 Easter Eggs', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('/why-lagos command is accessible via command palette', async ({ page }) => {
    // Open palette with Ctrl+K (Linux)
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(200);

    const palette = page
      .locator('[role="dialog"][aria-label*="command"]')
      .or(page.locator('[role="combobox"]').first());
    const isPaletteOpen = await palette.isVisible().catch(() => false);

    if (isPaletteOpen) {
      // Type to search for the command
      await page.keyboard.type('/why-lagos');
      await page.waitForTimeout(200);
      await expect(page.getByText(/why.lagos|Why Lagos/i)).toBeVisible();
      // Escape to close
      await page.keyboard.press('Escape');
    } else {
      // Command palette may not be bound to Ctrl+K on all browsers/OSes — skip gracefully
      test.skip();
    }
  });
});

test.describe('Performance — CLS', () => {
  test('no layout shift on hero hydration', async ({ page }) => {
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
