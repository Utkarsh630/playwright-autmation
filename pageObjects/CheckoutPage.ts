import { Locator, Page } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly countryInput: Locator;
  readonly countryResults: Locator;
  readonly placeOrderButton: Locator;
  readonly confirmationMessage: Locator;
  readonly orderId: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countryInput = page.getByPlaceholder("Select Country");
    this.countryResults = page.locator(".ta-results");
    this.placeOrderButton = page.getByText("Place Order");
    this.confirmationMessage = page.getByText(" Thankyou for the order. ");
    this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
  }

  getField(label: string) {
    return this.page.locator(`.field:has(.title:has-text("${label}"))`);
  }

  async enterCreditCardNumber(cardNumber: string) {
    await this.getField("Credit Card Number ")
      .getByRole("textbox")
      .fill(cardNumber);
  }

  async selectExpiryDate(month: string, year: string) {
    const expiryDate = this.getField("Expiry Date").getByRole("combobox");

    await expiryDate.first().selectOption(month);
    await expiryDate.nth(1).selectOption(year);
  }

  async enterCvvCode(cvv: string) {
    await this.getField("CVV Code").getByRole("textbox").fill(cvv);
  }

  async enterNameOnCard(name: string) {
    await this.getField("Name on Card").getByRole("textbox").fill(name);
  }

  async selectCountry(searchText: string, country: string) {
    await this.countryInput.pressSequentially(searchText);
    await this.countryResults
      .getByRole("button")
      .filter({ hasText: country })
      .nth(1)
      .click();
  }

  getUserEmail(email: string) {
    return this.page.getByText(email);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  getOrderConfirmationMessage() {
    return this.confirmationMessage;
  }

  async getOrderId() {
    return this.orderId.textContent();
  }
}
