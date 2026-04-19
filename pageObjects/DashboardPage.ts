import { Locator, Page } from "@playwright/test";

export class DashboardPage{

    readonly products: Locator;
    readonly page: Page;
    readonly cartButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.products = page.locator(".card-body")
        this.cartButton = page
    .getByRole("listitem")
    .getByRole("button", { name: "Cart" });
    }

    async addProductToCart(productName: string) {
    const product = this.products.filter({ hasText: productName });

    await product
      .getByRole("button", { name: "Add To Cart" })
      .click();
  }

    async navigateToCart(){
        this.cartButton.click();
    }

}