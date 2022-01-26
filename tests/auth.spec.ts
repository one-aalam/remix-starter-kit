import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
});

test('should render the /auth page', async ({ page }) => {
  const title = page.locator('.app__title');
  await expect(title).toHaveText('Remix Starter Kit');
});

test(`should not allow login with the wrong credentials`, async ({ page }) => {
    await page.fill('input[name="email"]', 'username@email.com')
    await page.fill('input[name="password"]', 'wrongpasswordfor@email.com')
    await page.locator('form button[type="submit"]').click()
    expect(await page.locator('.error').innerText()).toEqual(`Invalid login credentials`)
});

test(`should allow login with the right credentials`, async ({ page }) => {
    await page.fill('input[name="email"]', process.env.PW_USER_EMAIL || '')
    await page.fill('input[name="password"]', process.env.PW_USER_PASS || '')
    await page.locator('form button[type="submit"]').click()
    await page.waitForLoadState('networkidle')
    expect(page.url().substr(page.url().lastIndexOf('/'))).toEqual('/profile')
    await page.context().storageState({ path: 'tests/state.json' });
});
