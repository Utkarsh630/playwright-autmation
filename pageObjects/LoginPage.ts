import { expect, Locator, Page } from "@playwright/test";

export class LoginPage{

    readonly signInButton: Locator;
    readonly userName: Locator;
    readonly password: Locator;
    readonly toastContainer: Locator;
    readonly page: Page;

    constructor(page: Page){
        this.signInButton = page.getByRole("button", { name: "Login" });
        this.userName = page.getByPlaceholder("email@example.com");
        this.password = page.getByPlaceholder("enter your passsword");
        this.toastContainer = page.locator(".toast-container");
        this.page = page;
    }

    async navigateToLoginPage(){
        await this.page.goto("https://rahulshettyacademy.com/client", {
    waitUntil: "networkidle",
  });
    }

    async validLogin(username: string, password: string){
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.signInButton.click();
    }

    async getToastMessage(){
         return this.toastContainer;
    }

}


