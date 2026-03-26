import {test, expect} from "@playwright/test";

test("User should be able to login with valid credentials and add product to cart", async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("ush@gmail.com");
    await page.locator("#userPassword").fill("Usha@1234");
    await page.locator("#login").click();

    const msg = await page.locator(".toast-container").textContent();

    expect(msg).toContain("Login Successfully");

    await page.waitForLoadState("networkidle");

    const productCards = await page.locator('.card-body');

    for(let i=0;i < await productCards.count();i++){
        const productTitles = await productCards.locator("h5 b").allTextContents();
        if(productTitles[i].trim() === "ZARA COAT 3"){
            await productCards.nth(i).locator("text =  Add To Cart").click();
            break;
        }
    }

    await page.locator("[routerLink*='cart']").click();
    await page.locator("div li").first().waitFor();

    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();
})
