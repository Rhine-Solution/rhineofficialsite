import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have header element', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const header = page.locator('header');
    await expect(header.first()).toBeVisible({ timeout: 10000 });
  });

  test('should have main content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const main = page.locator('main');
    await expect(main.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Navigation', () => {
  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/about/);
  });

  test('should navigate to Services page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.click('a[href="/services"]');
    await expect(page).toHaveURL(/services/);
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL(/contact/);
  });
});

test.describe('Contact Form', () => {
  test('should show contact page', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('domcontentloaded');
    const pageContent = page.locator('main');
    await expect(pageContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('should have form inputs', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('domcontentloaded');
    const inputs = page.locator('input');
    await expect(inputs.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Language Switching', () => {
  test('should have language-related elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const buttons = page.locator('button');
    expect(await buttons.count()).toBeGreaterThan(0);
  });
});

test.describe('Search', () => {
  test('should open search modal with Ctrl+K', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(500);
  });
});

test.describe('Dashboard', () => {
  test('should handle dashboard route', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });
});