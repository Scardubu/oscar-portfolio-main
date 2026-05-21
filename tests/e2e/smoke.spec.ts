import { expect, test } from '@playwright/test';

const sections = [
  { name: 'Projects', id: 'section-projects' },
  { name: 'About', id: 'section-about' },
  { name: 'Contact', id: 'section-contact' },
] as const;

test('hero is visible above the fold', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /The system has to work at 2am/i,
    })
  ).toBeVisible();
  await expect(page.locator('[aria-label*="available for Staff"]').first()).toContainText(
    /Updated \w+ \d{4}/
  );
});

test('mobile viewport has no horizontal overflow', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Single overflow check is enough on Chromium.');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );

  expect(hasOverflow).toBe(false);
});

test('all required project cards render', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('[data-project-id="sabiscore"]')).toBeVisible();
  await expect(page.locator('[data-project-id="hashablanca"]')).toBeVisible();
  await expect(page.locator('[data-project-id="taxbridge"]')).toBeVisible();
});

test.skip('nav links scroll to matching sections', async ({ page }) => {
  await page.goto('/');

  const navToggle = page.getByRole('button', {
    name: /Open navigation menu|Close navigation menu/i,
  });
  const isMobileNavigation = await navToggle.isVisible();

  for (const section of sections) {
    if (isMobileNavigation) {
      await navToggle.click();
      await page
        .getByRole('dialog', { name: 'Navigation menu' })
        .getByRole('link', { name: section.name })
        .click();
    } else {
      await page.getByRole('link', { name: section.name }).first().click();
    }

    await expect(page).toHaveURL(new RegExp(`#${section.id}`));
    await expect(page.locator(`#${section.id}`)).toBeAttached();
  }
});

test('all target blank links include noopener noreferrer', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('a[target="_blank"]');
  const count = await links.count();

  for (let index = 0; index < count; index += 1) {
    await expect(links.nth(index)).toHaveAttribute('rel', 'noopener noreferrer');
  }
});
