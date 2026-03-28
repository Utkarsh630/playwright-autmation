import {test, expect} from "@playwright/test";

test("User should be able to login with valid credentials and add product to cart", async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/client",{
        waitUntil: "networkidle"
    });
    await page.locator("#userEmail").fill("ush@gmail.com");
    await page.locator("#userPassword").fill("Usha@1234");
    await page.locator("#login").click();
    
    await expect(page.locator(".toast-container")).toContainText("Login Successfully");;

    await page.waitForLoadState("networkidle");

    const productCards = await page.locator('.card-body');

    for(let i=0;i < await productCards.count();i++){
        const title = await productCards.nth(i).locator("h5 b").textContent();
        if(title?.trim() === "ZARA COAT 3"){
            await productCards.nth(i).locator("text=Add To Cart").click();
            break;
        }
    }

    await page.waitForLoadState("domcontentloaded");

    await page.locator("[routerLink*='cart']").click();
    await page.locator("div li").first().waitFor();

    await expect(page.locator("h3:has-text('ZARA COAT 3')")).toBeVisible();

    await page.locator("text = Checkout").click();

    await page.locator(".input.txt.text-validated").first().fill("4542 9931 9292 2293");
    await page.locator("select.input.ddl").first().selectOption("03");
    await page.locator("select.input.ddl").last().selectOption("30");
    await page.locator("input.txt").nth(2).fill("123");
    await page.locator("input.txt").nth(3).fill("Usha");
    await page.locator("[placeholder='Select Country']").pressSequentially("Ind");

    const dropdown = page.locator(".ta-results.list-group.ng-star-inserted");
    await dropdown.waitFor();
    let optionsCount = await dropdown.locator("button").count();

    for(let i =0;i<optionsCount;i++){
        let text = await dropdown.locator("button").nth(i).textContent();
        if(text === " India"){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    await page.locator("text=Place Order ").click();
    
})
