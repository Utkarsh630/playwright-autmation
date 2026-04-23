// Scenario:
// For Chrome process get value of CPU load.
// Compare it with value in the yellow label.

import {test, expect, Locator} from '@playwright/test';

test("verify chrome cpu load in dynamic web table", async ({page})=>{

    await page.goto("https://practice.expandtesting.com/dynamic-table");

    const tableBody: Locator = page.locator("table.table tbody");

    await expect(tableBody).toBeVisible();

    const rows: Locator[]= await tableBody.locator("tr").all();

let cpuLoad: string='';
    for(const row of rows){

       const processName: string = await row.locator("td").first().innerText();

       if(processName === 'Chrome'){
        cpuLoad = await row.locator("td",{hasText: '%'}).innerText();
        break;
       }        
    }

    let yelloweBoxText = await page.locator("#chrome-cpu").innerText();

    expect(yelloweBoxText).toContain(cpuLoad);


})