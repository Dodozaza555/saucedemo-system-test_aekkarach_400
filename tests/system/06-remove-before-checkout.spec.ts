import { test, expect } from '@playwright/test';

test('EX-02: ลบสินค้าออกก่อน Checkout แล้ว Overview เหลือสินค้าเดียว', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' }).getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' }).getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('button', { name: 'Cart, 2 items' }).click();

  await expect(page.locator('.cart_item')).toHaveCount(2);
  await page.locator('.cart_item').filter({ hasText: 'Sauce Labs Bike Light' }).getByRole('button', { name: 'Remove' }).click();
  await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();

  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill('Aekkarach');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Student');
  await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('10110');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/checkout-step-two.html/);
  await expect(page.locator('.cart_item')).toHaveCount(1);
  await expect(page.locator('.cart_item .inventory_item_name')).toHaveText('Sauce Labs Backpack');
});