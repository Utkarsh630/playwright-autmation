import {test, expect} from "@playwright/test";

test("User should be able to login with valid credentials", async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("ush@gmail.com");
    await page.locator("#userPassword").fill("Usha@1234");
    await page.locator("#login").click();

    const msg = await page.locator(".toast-container").textContent();

    expect(msg).toContain("Login Successfully");

})
