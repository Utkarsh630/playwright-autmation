import { Locator, Page } from "@playwright/test";

export class CartPage{

    readonly checkOutButton: Locator;
    readonly page: Page;
    readonly cartItemList: Locator;
    constructor(page: Page){
        this.checkOutButton = page.getByRole("button", { name: "Checkout" });
        this.cartItemList = page.locator("div li");
        this.page= page;
    }

    async waitForCartItemsToLoad(){
        await this.cartItemList.first().waitFor();

    }

    verifyCartItem(productname: string){
        return this.page.getByText(`${productname}`);
    }

    async checkout(){
        await this.checkOutButton.click();
    }

}
