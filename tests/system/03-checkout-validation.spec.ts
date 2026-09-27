import { test, expect } from '@playwright/test';

test('ST-03: Checkout ต้องตรวจสอบข้อมูลที่จำเป็น', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' }).getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();
  await page.getByRole('button', { name: /Cart/ }).click();
  await expect(page).toHaveURL(/cart.html/);
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/checkout-step-one.html/);
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByRole('alert')).toContainText('First Name is required');
  await expect(page).toHaveURL(/checkout-step-one.html/);
});