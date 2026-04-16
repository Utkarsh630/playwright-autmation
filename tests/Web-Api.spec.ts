import { test, expect, request } from "@playwright/test";
import APIUtils from "./utils/apiUtils";

const loginPayLoad = { userEmail: "ush@gmail.com", userPassword: "Usha@1234" };
const orderPayLoad = {
  orders: [{ country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3" }],
};
let response: { token: string; orderId: string };
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});

test("User should be able to login with valid credentials and add product to cart", async ({
  page,
}) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client", {
    waitUntil: "networkidle",
  });

  // to verify order in order history

  await page.locator("button[routerLink*='myorders']").click();

  await page.locator("tbody").waitFor();

  const rows = page.locator(".table.table-hover tbody tr");

  const rowCount = await rows.count();
  let found = false;
  for (let i = 0; i < rowCount; i++) {
    const cellText = await rows.nth(i).locator("th").textContent();
    console.log(cellText);
    if (response.orderId && cellText && response.orderId.includes(cellText)) {
      console.log("Order found in order history");
      found = true;
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  expect(found).toBeTruthy();

  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(orderIdDetails?.trim()).toBe(response.orderId);
});
