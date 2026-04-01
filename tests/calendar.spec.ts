import { test, expect } from "@playwright/test";

test("Calendar Validation", async({page})=>{

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    
    const date = "15";
    const currentMonth = "6";
    const currentYear = "2027";
   

    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();

    await page.getByText(currentYear).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(currentMonth)-1).click();
    await page.locator(`//abbr[text()='${date}']`).click();


});