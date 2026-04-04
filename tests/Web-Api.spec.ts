import { test, expect, request } from "@playwright/test";

let token: string;

test.beforeAll( async ()=>{

    const apiContext = await request.newContext()
   const loginRespone = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
      data: {
        userEmail: "ush@gmail.com",
        userPassword: "Usha@1234"
      }
    });

    expect(loginRespone.ok()).toBeTruthy();

    const loginResponseJson = await loginRespone.json();
    token = loginResponseJson.token;
    console.log(token);
    
});


test.beforeEach( ()=>{

});

test("User should be able to login with valid credentials and add product to cart", async ({
  page,
}) => {


   await page.addInitScript(value =>{
    window.localStorage.setItem('token', value);
   }, token);   
  const email = "ush@gmail.com";
     await page.goto("https://rahulshettyacademy.com/client", {
    waitUntil: "networkidle",
  });   

  await expect(page.locator(".toast-container")).toContainText(
    "Login Successfully",
  );

  await page.waitForLoadState("networkidle");
  await page.locator(".card-body b").first().waitFor();

  await page
    .locator(".card-body")
    .filter({ hasText: "ZARA COAT 3" })
    .getByRole("button", { name: " Add To Cart" })
    .click();

  await page.waitForLoadState("domcontentloaded");

  await page
    .getByRole("listitem")
    .getByRole("button", { name: "Cart" })
    .click();
  await page.locator("div li").first().waitFor();

  await expect(page.getByText("ZARA COAT 3")).toBeVisible();

  await page.getByRole("button", { name: "Checkout" }).click();

  const getField = (label: string) =>
    page.locator(`.field:has(.title:has-text("${label}"))`);

  await getField("Credit Card Number ")
    .getByRole("textbox")
    .fill("4542 9931 9292 2293");

  await getField("Expiry Date")
    .getByRole("combobox")
    .first()
    .selectOption("03");

  await getField("Expiry Date").getByRole("combobox").nth(1).selectOption("30");

  await getField("CVV Code").getByRole("textbox").fill("123");
  
  await getField("Name on Card").getByRole("textbox").fill("Usha");

  await page.getByPlaceholder("Select Country").pressSequentially("Ind");

await page
  .locator('.ta-results')
  .getByRole('button')
  .filter({ hasText: 'India' })
  .nth(1)
  .click();

  await expect(page.getByText("ush@gmail.com")).toHaveText(
    email,
  );

  await page.getByText("Place Order").click();

  await expect(page.getByText(" Thankyou for the order. ")).toHaveText(
    " Thankyou for the order. ",
  );

  const orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(orderId);

  // to verify order in order history

    await page.locator("button[routerLink*='myorders']").click();

    await page.getByRole("listitem").getByRole("button", {name: "  ORDERS"}).click();

    await page.locator("tbody").waitFor();

    const rows = page.locator(".table.table-hover tbody tr");

    const rowCount = await rows.count();

    console.log("Total rows in order history: " + rowCount);

    for (let i = 0; i < rowCount; i++) {
        const cellText = await rows.nth(i).locator("th").textContent();
        console.log(cellText);
        if (orderId && cellText && orderId.includes(cellText)) {
        console.log("Order found in order history");
        await rows.nth(i).locator("button").first().click();
        break;
        }
    }
});