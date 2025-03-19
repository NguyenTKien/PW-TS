import { Locator, Page } from "@playwright/test";
import { BaseTest } from "./basetest";

export class BookingPage extends BaseTest {
    readonly bookingPage: Locator;

    constructor(page: Page) {
        super(page);
        this.bookingPage = page.locator("//div[@role='table'][@aria-label = 'Month View']");
    }

    async goToBookingPage() {
      this.page.goto("/admin/report");
    }

    async moveToElement(page: Page, locator: Locator) {
        const box = await locator.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        }
      }
}