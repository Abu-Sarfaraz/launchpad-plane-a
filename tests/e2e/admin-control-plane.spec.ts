import { test, expect } from '@playwright/test';

test.describe('Admin Control Plane E2E Flow', () => {
  test('redirects unauthenticated visitor to /admin/login', async ({ page }) => {
    // Navigate without cookies or headers
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/admin\/login/);
    await expect(page.getByRole('heading', { name: /Platform Administration/i })).toBeVisible();
    await expect(page.getByLabel(/Admin Secret Key/i)).toBeVisible();
  });

  test('authenticates via admin secret key and reaches control plane', async ({ page }) => {
    await page.goto('/admin/login');

    await page.getByLabel(/Admin Secret Key/i).fill('papergen_admin_sec_9941a87b21e843cd');
    await page.getByRole('button', { name: /Verify & Enter Admin Console/i }).click();

    // Verify redirected to /admin
    await expect(page).toHaveURL(/.*\/admin/);
    await expect(page.getByRole('heading', { name: /PaperGen Control Plane/i })).toBeVisible();

    // Check all 4 management tabs exist
    await expect(page.getByRole('button', { name: /AI Engine & Fallback Studio/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /User Management/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Orders & Transactions/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Environment & Credentials Audit/i })).toBeVisible();
  });
});
