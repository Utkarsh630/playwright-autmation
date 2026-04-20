import { Locator, Page } from "@playwright/test";

export class OrdersPage {
  readonly page: Page;
  readonly myOrdersButton: Locator;
  readonly ordersNavButton: Locator;
  readonly ordersTable: Locator;
  readonly orderRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myOrdersButton = page.locator("button[routerLink*='myorders']");
    this.ordersNavButton = page
      .getByRole("listitem")
      .getByRole("button", { name: "  ORDERS" });
    this.ordersTable = page.locator("tbody");
    this.orderRows = page.locator(".table.table-hover tbody tr");
  }

  async navigateToOrders() {
    await this.myOrdersButton.click();
    await this.ordersNavButton.click();
    await this.ordersTable.waitFor();
  }

  async openOrder(orderId: string | null) {
    const rowCount = await this.orderRows.count();

    for (let i = 0; i < rowCount; i++) {
      const orderIdCellText = await this.orderRows
        .nth(i)
        .locator("th")
        .textContent();
      console.log(orderIdCellText);

      if (orderId && orderIdCellText && orderId.includes(orderIdCellText)) {
        console.log("Order found in order history");
        await this.orderRows.nth(i).locator("button").first().click();
        return true;
      }
    }

    return false;
  }
}
