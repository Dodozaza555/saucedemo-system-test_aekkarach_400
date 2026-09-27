import { test, expect } from '@playwright/test';

test('EX-01: เรียงสินค้าตามราคาจากน้อยไปมากได้ถูกต้อง', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory.html/);
  await page.getByRole('combobox', { name: 'Sort products' }).selectOption({ label: 'Price (low to high)' });

  const prices = await page.locator('.inventory_item_price').allTextContents();
  const numericPrices = prices.map((price) => Number.parseFloat(price.replace('$', '')));

  expect(numericPrices).toEqual([...numericPrices].sort((first, second) => first - second));
});