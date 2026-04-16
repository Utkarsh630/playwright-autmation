import { test, expect, Browser, Page } from "@playwright/test";

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const API_URL = `https://api.eventhub.rahulshettyacademy.com/api`;

const YAHOO_USER = {email: "rete@yahoo.com",  password: "Abc@12345"};
const GOOGLE_USER ={email: 'tetre@gmail.com', password: 'Abc@12345'};

async function loginAs(page: Page, user: { email: string; password: string; }) {
  await page.goto(`${BASE_URL}/login`);

  await page.getByPlaceholder("you@email.com").fill(user.email);

  await page.getByLabel("Password").fill(user.password);

  await page.locator("#login-btn").click();
  const eventsLink = page.getByRole("link", { name: "Browse Events →" });
  await expect(eventsLink).toBeVisible();

}

test('gmail user sees Access Denied when viewing yahoo user booking', async ({page, request})=>{
const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: {email: YAHOO_USER.email, password: YAHOO_USER.password},
});

expect(loginRes.ok()).toBeTruthy();

const loginResJson = await loginRes.json();

console.log(loginResJson.token);

const eventRes = await request.get(`${API_URL}/events`,{
    headers: {Authorization: `Bearer ${loginResJson.token}`},
});

expect(eventRes.ok()).toBeTruthy();
const eventResJson = await eventRes.json();

const eventId = eventResJson.data[0].id;

console.log(eventId);


const bookingRes = await request.post(`${API_URL}/bookings`,{
    headers: {Authorization: `Bearer ${loginResJson.token}`},
    data: {
        eventId: `${eventId}`,
        customerName: "Yahoo_One",
        customerEmail: `${YAHOO_USER.email}`,
        customerPhone: "8912712678",
        quantity: 3
    }
});

expect(bookingRes.ok()).toBeTruthy();

const yahooBookingId = (await bookingRes.json()).data.id;

console.log(yahooBookingId);

  await loginAs(page, GOOGLE_USER);

  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, {waitUntil: "networkidle"});

await expect(page.getByText('Access Denied')).toBeVisible();
  await expect(page.getByText('You are not authorized to view this booking')).toBeVisible();


});