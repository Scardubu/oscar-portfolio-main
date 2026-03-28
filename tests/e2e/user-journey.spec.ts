import { expect, test } from '@playwright/test';

test('recruiter journey moves from hero to projects to contact', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'Oscar Scardubu' })).toBeVisible();
  await page.getByRole('link', { name: 'View Projects' }).click();
  await expect(page.locator('#projects')).toBeInViewport();

  await expect(page.getByRole('heading', { level: 2, name: 'Production Systems' })).toBeVisible();
  await expect(page.locator('[data-project-id="sabiscore"]')).toBeVisible();

  await page.getByRole('link', { name: 'Get in Touch' }).click();
  await expect(page.locator('#contact')).toBeInViewport();
  await expect(page.getByRole('heading', { level: 2, name: 'Let’s Build Something' })).toBeVisible();
});
