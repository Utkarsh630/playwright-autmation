import { test, expect } from "@playwright/test";
import { LoginPage } from "../pageObjects/LoginPage";
import { DashboardPage } from "../pageObjects/DashboardPage";
import { CartPage } from "../pageObjects/CartPage";
import { CheckoutPage } from "../pageObjects/CheckoutPage";
import { OrdersPage } from "../pageObjects/OrdersPage";

test("User should be able to login with valid credentials and add product to cart", async ({
  page,
}) => {
  const email = "ush@gmail.com";
  const password = "Usha@1234";
  const productName = "ZARA COAT 3";
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.validLogin(email, password);

  await expect(loginPage.getToastMessage()).toContainText(
    "Login Successfully",
  );

  await page.waitForLoadState("networkidle");

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.addProductToCart(productName);

  await dashboardPage.navigateToCart();

  const cartPage = new CartPage(page);

  await cartPage.waitForCartItemsToLoad();

  await expect(cartPage.verifyCartItem(productName)).toBeVisible();
  await cartPage.checkout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.enterCreditCardNumber("4542 9931 9292 2293");
  await checkoutPage.selectExpiryDate("03", "30");
  await checkoutPage.enterCvvCode("123");
  await checkoutPage.enterNameOnCard("Usha");
  await checkoutPage.selectCountry("Ind", "India");
  await expect(checkoutPage.getUserEmail(email)).toHaveText(email);
  await checkoutPage.placeOrder();
  await expect(checkoutPage.getOrderConfirmationMessage()).toHaveText(
    " Thankyou for the order. ",
  );

  const orderId = await checkoutPage.getOrderId();
  console.log(orderId);

  const ordersPage = new OrdersPage(page);
  await ordersPage.navigateToOrders();
  expect(await ordersPage.openOrder(orderId)).toBeTruthy();
});

test("Visual testing", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  expect(await page.screenshot()).toMatchSnapshot("landing.png");
});
