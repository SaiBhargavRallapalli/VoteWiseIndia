/**
 * @file e2e/chat.spec.js
 * @description E2E tests for the AI chat assistant panel.
 */

const { test, expect } = require('@playwright/test');

test.describe('AI Chat Assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-panel="chat"]');
  });

  test('chat panel loads with welcome message', async ({ page }) => {
    const welcome = page.locator('.msg.bot .msg-bubble');
    await expect(welcome).toContainText('Namaste');
  });

  test('chat input field is visible', async ({ page }) => {
    const input = page.locator('#chat-input');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', /Ask about elections/);
  });

  test('send button is visible', async ({ page }) => {
    const sendBtn = page.locator('#send-btn');
    await expect(sendBtn).toBeVisible();
  });

  test('quick question buttons exist', async ({ page }) => {
    const quickBtns = page.locator('.quick-btn');
    const count = await quickBtns.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('clicking a quick question fills and sends message', async ({ page }) => {
    await page.click('.quick-btn >> nth=0');
    // After clicking, a user message should appear in the chat
    const userMsg = page.locator('.msg.user .msg-bubble');
    await expect(userMsg.first()).toBeVisible({ timeout: 5_000 });
  });

  test('typing and sending a message shows user bubble', async ({ page }) => {
    await page.fill('#chat-input', 'What is NOTA?');
    await page.click('#send-btn');
    const userMsg = page.locator('.msg.user .msg-bubble');
    await expect(userMsg.first()).toContainText('What is NOTA?');
  });
});
