//@ts-check
import { test, expect } from'@playwright/test';

test('get occupation stats', async ({ page }) => {
    await page.goto('https://sos2223-19.appspot.com/');
  
    // Click the get started link.
    await page.getByRole('link', { name: 'Grafo de la estadistica de ocupacion en campings' }).click();
  
    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*graphJLN/);
  });

  test('get analytics', async ({ page }) => {
    await page.goto('https://sos2223-19.appspot.com/');
  
    // Click the get started link.
    await page.getByRole('link', { name: 'Grafo general' }).click();
  
    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*analytics/);
  });

  test('get uses and integrations', async ({ page }) => {
    await page.goto('https://sos2223-19.appspot.com/');
  
    // Click the get started link.
    await page.getByRole('link', { name: 'Integraciones estadisticas de ocupacion' }).click();
  
    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*integrations/);
  });