import {test, expect} from '@playwright/test';

test('Login Page should have correct title', async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
})

test('Student should be able to login with valid credentials', async ({page})=>{
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        const username = (await page.locator('p.text-center.text-white b:nth-child(1) i').textContent())?.trim();
        let password = (await page.locator('p.text-center.text-white b:nth-child(2) i').textContent())?.trim();
        if (!username || !password) {
                throw new Error("Credentials not found on page");
            }
        await page.getByLabel("Username:").fill(username);
        await page.getByLabel("Password:").fill(password);

        await page.locator('#terms').check();

        await page.locator('#signInBtn').click();
})

test('Teacher should be able to login with valid credentials', async ({page})=>{
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        const username = (await page.locator('p.text-center.text-white b:nth-child(1) i').textContent())?.trim();
        let password = (await page.locator('p.text-center.text-white b:nth-child(2) i').textContent())?.trim();
        if (!username || !password) {
                throw new Error("Credentials not found on page");
            }
        await page.getByLabel("Username:").fill(username);
        await page.getByLabel("Password:").fill(password);

        const adminRadioCheck = page.locator("//input[@value='admin']");
        adminRadioCheck.check();

        expect(adminRadioCheck).toBeChecked();
        
        await page.locator(".form-group select").selectOption("Teacher");

         await page.locator('#terms').check();

         await page.locator('#signInBtn').click();
})

