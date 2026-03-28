import { expect, test } from '@playwright/test';

const sections = [
  { name: 'Projects', id: 'projects' },
  { name: 'About', id: 'about' },
  { name: 'Contact', id: 'contact' },
] as const;

test('hero is visible above the fold', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Oscar Scardubu' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Available — Staff+ · Co-founder · Consulting');
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
  await expect(page.locator('[data-project-id="ml-consulting"]')).toBeVisible();
});

test('nav links scroll to matching sections', async ({ page }) => {
  await page.goto('/');

  const navToggle = page.getByRole('button', { name: 'Toggle navigation' });
  const isMobileNavigation = await navToggle.isVisible();

  for (const section of sections) {
    if (isMobileNavigation) {
      await navToggle.click();
      await page.locator('#mobile-navigation').getByRole('link', { name: section.name }).click();
    } else {
      await page.getByRole('link', { name: section.name }).first().click();
    }

    await expect(page.locator(`#${section.id}`)).toBeInViewport();
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
