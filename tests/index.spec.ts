import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('should render "Remix Starter Kit"', async ({ page }) => {
  const title = page.locator('.app__title');
  await expect(title).toHaveText('Remix Starter Kit');
});

test('should show the nvigation button for the auth page', async ({ page }) => {
    const btnGoToAuthPage = page.locator('.action__auth');
    await expect(btnGoToAuthPage).toBeVisible()
});

test('should navigate to the /auth page on click', async ({ page }) => {
    await page.click('.action__auth')
    expect(page.url().substr(page.url().lastIndexOf('/'))).toEqual('/auth')
});
