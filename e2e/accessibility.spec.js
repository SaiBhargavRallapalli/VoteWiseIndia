/**
 * @file e2e/accessibility.spec.js
 * @description E2E accessibility tests (ARIA, keyboard navigation, semantic HTML).
 */

const { test, expect } = require('@playwright/test');

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page has exactly one h1 element', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('all nav tabs have role="tab"', async ({ page }) => {
    const tabs = page.locator('.nav-btn');
    const count = await tabs.count();
    for (let i = 0; i < count; i++) {
      await expect(tabs.nth(i)).toHaveAttribute('role', 'tab');
    }
  });

  test('all panels have role="tabpanel"', async ({ page }) => {
    const panels = page.locator('.panel');
    const count = await panels.count();
    for (let i = 0; i < count; i++) {
      await expect(panels.nth(i)).toHaveAttribute('role', 'tabpanel');
    }
  });

  test('main landmark exists with id="main-content"', async ({ page }) => {
    const main = page.locator('main#main-content');
    await expect(main).toBeVisible();
  });

  test('external links have rel="noopener noreferrer"', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });

  test('language selector has aria-label', async ({ page }) => {
    const langSelect = page.locator('#lang-select');
    await expect(langSelect).toHaveAttribute('aria-label', 'Select language');
  });

  test('keyboard Tab navigates between nav buttons', async ({ page }) => {
    // Focus the first nav button
    await page.locator('.nav-btn').first().focus();
    // Press Tab to move to the next
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.dataset?.panel);
    expect(focused).toBeDefined();
  });

  test('chat input has associated label', async ({ page }) => {
    await page.click('[data-panel="chat"]');
    const label = page.locator('label[for="chat-input"]');
    await expect(label).toHaveCount(1);
  });

  test('images and decorative elements have aria-hidden', async ({ page }) => {
    const logoIcon = page.locator('.logo-icon');
    await expect(logoIcon).toHaveAttribute('aria-hidden', 'true');
    const chakra = page.locator('.chakra');
    await expect(chakra).toHaveAttribute('aria-hidden', 'true');
  });
});
