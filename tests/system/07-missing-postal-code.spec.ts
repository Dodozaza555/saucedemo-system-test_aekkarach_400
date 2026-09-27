import { test, expect } from '@playwright/test';

test('EX-03: Checkout ต้องแจ้งเตือนเมื่อไม่กรอก Postal Code', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' }).getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('button', { name: 'Cart, 1 items' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.getByRole('textbox', { name: 'First Name' }).fill('Aekkarach');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Student');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByRole('alert')).toContainText('Postal Code is required');
  await expect(page).toHaveURL(/checkout-step-one.html/);
});