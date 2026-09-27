import { test, expect } from '@playwright/test';

test('ST-02: Locked User ไม่สามารถเข้าใช้งานระบบได้', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('textbox', { name: 'Username' }).fill('locked_out_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('alert')).toContainText(
    'Epic sadface: Sorry, this user has been locked out.'
  );
  await expect(page).not.toHaveURL(/inventory\.html/);
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
});