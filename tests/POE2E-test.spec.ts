import { test, expect } from "@playwright/test";
import { LoginPage } from "../pageObjects/LoginPage";
import { DashboardPage } from "../pageObjects/DashboardPage";
import { CartPage } from "../pageObjects/CartPage";

test("User should be able to login with valid credentials and add product to cart", async ({
  page,
}) => {
  const email = "ush@gmail.com";
  const password = "Usha@1234";
  const productName= "ZARA COAT 3";
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.validLogin(email, password);

  expect(await loginPage.getToastMessage()).toContainText(
    "Login Successfully",
  );

  await page.waitForLoadState("networkidle");


  const dashboardPage = new DashboardPage(page);
  await dashboardPage.addProductToCart("ZARA COAT 3");

  await dashboardPage.navigateToCart();
  
  const cartPage = new CartPage(page);

  cartPage.waitForCartItemsToLoad();

  expect(await cartPage.verifyCartItem(productName)).toBeVisible();
  await cartPage.checkout();


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

test('Visual testing', async ({page})=>{
   await page.goto("https://rahulshettyacademy.com/client", {
    waitUntil: "networkidle",
  });
  expect(await page.screenshot()).toMatchSnapshot('landing.png');
})