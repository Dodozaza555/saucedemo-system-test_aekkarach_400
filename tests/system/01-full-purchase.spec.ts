import { test, expect } from '@playwright/test';

test('ST-01: User ซื้อสินค้าตั้งแต่ Login จน Finish ได้สำเร็จ', async ({ page }) => {
  // Arrange: เปิดระบบและเตรียมข้อมูลสำหรับผู้ใช้มาตรฐาน
  await page.goto('/');
  await expect(page).toHaveTitle(/Swag Labs/);
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');

  // Act: Login และดำเนิน business flow ตั้งแต่ Inventory ถึง Checkout
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Assert: checkpoint หลัง Login และก่อนเพิ่มสินค้า
  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();
  await expect(page.locator('.inventory_item')).toHaveCount(6);

  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();
  await page.getByRole('button', { name: /Cart/ }).click();

  // Assert: checkpoint ของ Cart และ Checkout Overview
  await expect(page).toHaveURL(/cart.html/);
  await expect(page.locator('.cart_item .inventory_item_name')).toHaveText('Sauce Labs Backpack');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/checkout-step-one.html/);
  await page.getByRole('textbox', { name: 'First Name' }).fill('Aekkarach');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Student');
  await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('10110');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/checkout-step-two.html/);
  await expect(page.locator('.cart_item .inventory_item_name')).toHaveText('Sauce Labs Backpack');
  await expect(page.locator('.summary_info')).toBeVisible();
  await expect(page.getByText(/Total:/)).toBeVisible();

  // Act ต่อ: ยืนยันคำสั่งซื้อ
  await page.getByRole('button', { name: 'Finish' }).click();

  // Assert: ผลลัพธ์สุดท้ายของ System Test
  await expect(page).toHaveURL(/checkout-complete.html/);
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
});