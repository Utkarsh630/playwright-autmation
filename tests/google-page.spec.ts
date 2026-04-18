import {test, expect} from '@playwright/test';

test("Google App launcher", async({page})=>{

    await page.goto("https://www.google.com");

    await page.getByRole('button', {name: 'Google apps'}).click();

    const drive = page.frameLocator("iframe[src*='ogs']").getByRole('link', {name: 'Drive'});
    await expect(drive).toBeVisible();

    await page.screenshot({path: 'landing.png'});
})