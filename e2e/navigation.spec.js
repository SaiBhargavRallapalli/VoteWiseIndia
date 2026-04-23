/**
 * @file e2e/navigation.spec.js
 * @description E2E tests for page load, navigation, and accessibility.
 */

const { test, expect } = require('@playwright/test');

test.describe('Page Load & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title and meta', async ({ page }) => {
    await expect(page).toHaveTitle('VoteWise India | Your Election Guide');
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('VoteWise India');
  });

  test('header displays VoteWise India branding', async ({ page }) => {
    const logo = page.locator('.logo-text');
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('VoteWise');
  });

  test('all 12 navigation tabs are visible', async ({ page }) => {
    const tabs = page.locator('.nav-btn');
    await expect(tabs).toHaveCount(12);
  });

  test('Home panel is active by default', async ({ page }) => {
    const homePanel = page.locator('#panel-home');
    await expect(homePanel).toHaveClass(/active/);
  });

  test('hero section displays correct heading', async ({ page }) => {
    const heading = page.locator('.hero h1');
    await expect(heading).toContainText('Your Vote');
  });

  test('clicking a tab switches the active panel', async ({ page }) => {
    await page.click('[data-panel="quiz"]');
    const quizPanel = page.locator('#panel-quiz');
    await expect(quizPanel).toHaveClass(/active/);
    const homePanel = page.locator('#panel-home');
    await expect(homePanel).not.toHaveClass(/active/);
  });

  test('active tab gets aria-selected=true', async ({ page }) => {
    await page.click('[data-panel="chat"]');
    const chatTab = page.locator('[data-panel="chat"]');
    await expect(chatTab).toHaveAttribute('aria-selected', 'true');
    const homeTab = page.locator('[data-panel="home"]');
    await expect(homeTab).toHaveAttribute('aria-selected', 'false');
  });

  test('skip-to-content link exists for accessibility', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
