import { test, expect, Page } from "@playwright/test";

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const USERNAME = "ush@gmail.com";
const PASSWORD = "Abc@12345";

// Helper methods

async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`);

  await page.getByPlaceholder("you@email.com").fill(USERNAME);

  await page.getByLabel("Password").fill(PASSWORD);

  await page.locator("#login-btn").click();

  await expect(
    page.getByRole("link", { name: "Browse Events →" }),
  ).toBeVisible();
}

async function createEvent(page: Page, eventTitle: string) {
  await page.getByRole("button", { name: "Admin" }).click();
  await page.locator("a[href='/admin/events']").nth(0).click();

  await page.getByPlaceholder("Event title").fill(eventTitle);

  await page
    .getByPlaceholder("Describe the event…")
    .fill("This is a test event created by Playwright.");

  await page.locator("#category").selectOption("Concert");

  await page.getByLabel("city").fill("Noida");

  await page.getByLabel("venue").fill("Expo Mart");

  await page.getByLabel("Event Date & Time").fill(FutureDateTime(14));
  await page.getByLabel("Price ($)").fill("100");

  await page.getByLabel("Total Seats").fill("250");

  await page.getByTestId("add-event-btn").click();
}

async function createSingleBooking(page: Page) {
  fillBookingForm(page);
  await page.locator(".confirm-booking-btn").click();
}

async function createGroupBooking(page: Page, numberOfTickets: number) {
  fillBookingForm(page);

  for (let i = 1; i < numberOfTickets; i++) {
    const before = parseInt(
      await page.locator("#ticket-count").innerText(),
      10,
    );

    await page.locator("#ticket-count + button").click();

    await expect(async () => {
      const after = parseInt(
        await page.locator("#ticket-count").innerText(),
        10,
      );
      expect(after).toBe(before + 1);
    }).toPass();
  }
  await page.locator(".confirm-booking-btn").click();
}

async function fillBookingForm(page: Page) {
  await page.locator("#customerName").fill("John sin");
  await page.locator("#customer-email").fill("john.sin@email.com");
  await page.locator("#phone").fill("9876543210");
}

async function getSeatCount(page: Page, eventTitle: string): Promise<number> {
  await page.goto(`${BASE_URL}/events`);

  const eventCard = page
    .getByTestId("event-card")
    .filter({ hasText: eventTitle })
    .first();

  await expect(eventCard).toBeVisible();

  const text = await eventCard.locator("span:has-text('seat')").innerText();

  return parseInt(text.match(/\d+/)?.[0] || "0", 10);
}

async function openBooking(page: Page, eventTitle?: string) {
  await page.goto(`${BASE_URL}/events`);

  const eventCard = eventTitle ? page
    .getByTestId("event-card")
    .filter({ hasText: eventTitle })
    .first() : page.getByTestId("event-card").first();

  await eventCard.getByTestId("book-now-btn").click();
}

function FutureDateTime(daysAhead: number = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


test("EventHub Admin Login", async ({ page }) => {
  const eventTitle = `Test Event ${Date.now()}`;

  const numberOfTickets = 4;
  // Step 1 — Login

  await login(page);

  // Step 2 — Create a new event

  await createEvent(page, eventTitle);

  // Step 3 — Find the event card and capture seats

  const seatsBeforeBooking = await getSeatCount(page, eventTitle);

  await openBooking(page, eventTitle);

  // Step 5 — Create Single/ Group Booking

  numberOfTickets > 1 ? await createGroupBooking(page, numberOfTickets) : await createSingleBooking(page);

  // Step 6 — Verify booking confirmation

  await expect(page.getByText("Booking Confirmed! 🎉")).toBeVisible();

  // store booking reference number
  const bookingReference = await page.locator(".booking-ref").innerText();

  // view my bookings

  await page.getByRole("button", { name: "View My Bookings" }).click();

  await page.waitForURL(`${BASE_URL}/bookings`);

  expect(page.url()).toEqual(`${BASE_URL}/bookings`);

  const bookingCards = page.locator("#booking-card");
  await expect(bookingCards.first()).toBeVisible();

  const bookingCard = bookingCards.filter({ hasText: `${bookingReference}` });
  await expect(bookingCard).toBeVisible();

  await expect(bookingCard.locator("h3")).toHaveText(`${eventTitle}`);

  const seatsAfterBooking = await getSeatCount(page, eventTitle);

  expect(seatsAfterBooking).toBe(seatsBeforeBooking - numberOfTickets);
});


async function loginAndGoToBooking(page:Page) {
  await login(page);
  await expect(page.getByRole("link", {name: 'Browse Events →'})).toBeVisible();
}

test("Single ticket booking is eligible for refund", async ({page})=>{

  await loginAndGoToBooking(page);

  await openBooking(page);
  
  await createSingleBooking(page);

  await expect(page.getByText("Booking Confirmed! 🎉")).toBeVisible();

await navigateToBooking(page);


await checkRefundEligibility(page);

    const refundRes = await page.locator("#refund-result");
  await expect(refundRes).toBeVisible();

  await expect(refundRes).toContainText('Eligible for refund');
  await expect(refundRes).toContainText('Single-ticket bookings qualify for a full refund');

});

test("Group ticket booking is NOT eligible for refund", async ({page}) => {

  await loginAndGoToBooking(page);

  await openBooking(page);

  await createGroupBooking(page, 3);

  await expect(page.getByText("Booking Confirmed! 🎉")).toBeVisible();

  await navigateToBooking(page);

  await checkRefundEligibility(page);
  
  const refundRes = page.locator("#refund-result");
  await expect(refundRes).toBeVisible();

  await expect(refundRes).toContainText('Not eligible for refund');
  await expect(refundRes).toContainText('Group bookings (3 tickets) are non-refundable');

})

async function navigateToBooking(page:Page) {
   await page.getByRole("button", {name: 'View My Bookings'}).click();

  await page.getByRole("button", {name: 'View Details'}).first().click();

  await expect(page.getByText("Booking Information")).toBeVisible();

  const bookingRef = await page.locator("span.font-mono.font-bold").innerText();

  const evenTitle = await page.locator("h1.font-bold").innerText();

  expect(evenTitle.charAt(0)).toBe(bookingRef.charAt(0));
}

async function checkRefundEligibility(page:Page) {
  await page.getByTestId("check-refund-btn").click();

  await expect(page.getByTestId('refund-spinner')).toBeVisible();

  await expect(page.getByTestId('refund-spinner')).toBeHidden({timeout: 6000});

  await page.locator("#refund-result").waitFor();
}