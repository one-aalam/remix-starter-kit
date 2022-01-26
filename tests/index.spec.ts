import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  const title = page.locator('.app__title');
  await expect(title).toHaveText('Remix Starter Kit');
});
