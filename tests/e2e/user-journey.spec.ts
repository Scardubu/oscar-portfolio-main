import { expect, test } from '@playwright/test';

test('recruiter journey moves from hero to projects to contact', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /The system has to work at 2am/i,
    })
  ).toBeVisible();
  await page.getByRole('link', { name: 'See the work' }).click();
  await expect(page.locator('#section-projects')).toBeInViewport();

  await expect(
    page.getByRole('heading', { level: 2, name: /Built to survive real constraints/i })
  ).toBeVisible();
  await expect(page.locator('[data-project-id="sabiscore"]')).toBeVisible();

  await page.getByRole('link', { name: 'Contact' }).first().click();
  await expect(page.locator('#section-contact')).toBeInViewport();
  await expect(
    page.getByRole('heading', { level: 2, name: /The system is ready\. Are you\?/i })
  ).toBeVisible();
});
