/**
 * @file e2e/quiz.spec.js
 * @description E2E tests for the election quiz: load, answer, navigate, submit.
 */

const { test, expect } = require('@playwright/test');

test.describe('Election Quiz', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-panel="quiz"]');
    // Wait for quiz to load from the API
    await page.waitForSelector('.quiz-question', { timeout: 10_000 });
  });

  test('quiz loads with question 1 of 10', async ({ page }) => {
    const progress = page.locator('.progress-text');
    await expect(progress).toContainText('1 / 10');
    const question = page.locator('.quiz-question');
    await expect(question).toBeVisible();
  });

  test('quiz has 4 answer options', async ({ page }) => {
    const options = page.locator('.quiz-option');
    await expect(options).toHaveCount(4);
  });

  test('clicking an option highlights it', async ({ page }) => {
    const optionB = page.locator('.quiz-option').nth(1);
    await optionB.click();
    await expect(optionB).toHaveClass(/selected/);
  });

  test('Next button advances to question 2', async ({ page }) => {
    // Select an answer first
    await page.locator('.quiz-option').nth(0).click();
    // Click Next
    await page.click('#next-btn');
    const progress = page.locator('.progress-text');
    await expect(progress).toContainText('2 / 10');
  });

  test('completing all 10 questions shows results', async ({ page }) => {
    for (let i = 0; i < 10; i++) {
      await page.locator('.quiz-option').nth(0).click();
      if (i < 9) {
        await page.click('#next-btn');
        await page.waitForSelector('.progress-text');
      }
    }
    // After the 10th question, click Submit
    await page.click('#next-btn');
    // Results should show the score
    const result = page.locator('.result-score');
    await expect(result).toBeVisible({ timeout: 10_000 });
  });

  test('retake quiz resets to question 1', async ({ page }) => {
    // Complete the quiz quickly
    for (let i = 0; i < 10; i++) {
      await page.locator('.quiz-option').nth(0).click();
      await page.click('#next-btn');
      await page.waitForTimeout(200);
    }
    // Wait for results
    await page.waitForSelector('.result-score', { timeout: 10_000 });
    // Click retake
    await page.click('button:has-text("Retake Quiz")');
    const progress = page.locator('.progress-text');
    await expect(progress).toContainText('1 / 10');
  });
});
