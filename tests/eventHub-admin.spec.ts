import {test, expect, Page} from '@playwright/test';

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const USERNAME = "ush@gmail.com";
const PASSWORD = "Abc@12345";

async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`);

  await page.getByPlaceholder('you@email.com').fill(USERNAME);

  await page.getByLabel('Password').fill(PASSWORD);

  await page.locator('#login-btn').click();

  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

test("EventHub Admin Login", async({page})=>{
    
    const eventTitle = `Test Event ${Date.now()}`;

    // Step 1 — Login

    await login(page);

    // Step 2 — Create a new event

    await page.getByRole('button', {name: 'Admin'}).click();
    await page.locator("a[href='/admin/events']").nth(0).click();

    await page.getByPlaceholder("Event title").fill(eventTitle);

    await page.getByPlaceholder("Describe the event…").fill("This is a test event created by Playwright.");

    await page.locator("#category").selectOption("Concert");

    await page.getByLabel('city').fill("Noida");

    await page.getByLabel('venue').fill("Expo Mart");

    await page.getByLabel("Event Date & Time").fill(FutureDateTime(14));
    await page.getByLabel("Price ($)").fill("100");

    await page.getByLabel("Total Seats").fill("250");

    await page.getByTestId("add-event-btn").click();


    // Step 3 — Find the event card and capture seats
    
    await page.getByTestId("nav-events").click();

    const eventCard =  page.getByTestId("event-card").filter({hasText: `${eventTitle}`});
    await expect(eventCard).toBeVisible();
    const seatTextBefore = await eventCard
  .locator("span:has-text('seat')")
  .innerText();

    const seatsBeforeBooking = parseInt(seatTextBefore.match(/\d+/)?.[0] || "0", 10);

    // Step 4 — Start booking


    await eventCard.getByTestId("book-now-btn").click();

    // Step 5 — Fill booking form

    await page.locator("#customerName").fill("John sin");
    await page.locator("#customer-email").fill("john.sin@email.com");
    await page.locator("#phone").fill("9876543210");

    await page.locator(".confirm-booking-btn").click();

    // Step 6 — Verify booking confirmation

    await expect (page.getByText("Booking Confirmed! 🎉")).toBeVisible();

    const bookingReference = (await page.locator(".booking-ref").allInnerTexts())[0].trim();


    await page.getByRole('button', {name: 'View My Bookings'}).click();

    await page.waitForLoadState('networkidle');

    expect(page.url()).toEqual(`${BASE_URL}/bookings`);

    const bookingCards = page.locator("#booking-card");
    await expect(bookingCards.first()).toBeVisible();

    const bookingCard = bookingCards.filter({hasText: `${bookingReference}`});
    await expect(bookingCard).toBeVisible();

    await expect (bookingCard.locator("h3")).toHaveText(`${eventTitle}`);


        await page.getByTestId("nav-events").click();

        await page.waitForLoadState('networkidle');

    await expect(async () => {
  const updatedEventCard = page
    .getByTestId("event-card")
    .filter({ hasText: eventTitle });

  const text = await updatedEventCard
    .locator("span:has-text('seat')")
    .innerText();

  const seats = parseInt(text.match(/\d+/)?.[0] || "0", 10);

  expect(seats).toBe(seatsBeforeBooking - 1);
}).toPass({ timeout: 7000 });


});

function FutureDateTime(daysAhead: number = 7): string {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

