import { test, expect } from '@playwright/test';

test.describe('Phase 5: Multi-Viewport Responsive QA', () => {
  test('verifies landing page layout and interaction across viewports', async ({
    page,
  }) => {
    await page.goto('/');

    // Verify H1 and Hero CTAs
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Space-Tech Cloud');

    // Verify Dual CTAs
    const getStartedBtn = page.getByRole('button', { name: /Get Started/i });
    await expect(getStartedBtn).toBeVisible();

    // Verify Pricing Toggle
    const annualBtn = page.getByRole('button', { name: /Annual Billing/i });
    await expect(annualBtn).toBeVisible();
    await annualBtn.click();
    await expect(page.getByText('$79')).toBeVisible();

    // Switch back to monthly
    const monthlyBtn = page.getByRole('button', { name: /Monthly Billing/i });
    await monthlyBtn.click();
    await expect(page.getByText('$99')).toBeVisible();
  });

  test('verifies auth gateway page renders across viewports', async ({
    page,
  }) => {
    await page.goto('/auth');

    // Verify Auth Card
    await expect(page.getByText(/Orbital Cloud Gateway/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Continue with Google/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Continue with GitHub/i })
    ).toBeVisible();

    // Verify tabs
    const createMissionTab = page.getByRole('button', {
      name: /Create Mission/i,
    });
    await createMissionTab.click();
    await expect(
      page.getByRole('button', { name: /Create Mission Account/i })
    ).toBeVisible();
  });

  test('verifies customer dashboard components across viewports', async ({
    page,
  }) => {
    await page.setExtraHTTPHeaders({ 'x-playwright-test': 'true' });
    await page.goto('/dashboard');

    // Verify Mission Control Header
    await expect(page.getByText(/Mission Control & Deployment Hub/i)).toBeVisible();

    // Verify 4 KPI cards
    await expect(page.getByText('ACTIVE PROJECTS')).toBeVisible();
    await expect(page.getByText('PIPELINE VELOCITY')).toBeVisible();
    await expect(page.getByText('MONTHLY API QUOTA')).toBeVisible();
    await expect(page.getByText('RLS SECURITY STATUS')).toBeVisible();

    // Verify table search using getByPlaceholder
    const searchInput = page.getByPlaceholder(/Search projects or commit/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Relay');
    await expect(page.getByText('Telemetry WebSocket Relay')).toBeVisible();

    // Verify PaperGen AI Studio and Generation Controls
    await expect(page.getByText(/Autonomous Exam & Academic Paper Creator/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Paper with Multi-Provider AI/i })).toBeVisible();
  });
});
