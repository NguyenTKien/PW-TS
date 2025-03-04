import { Locator, Page } from "@playwright/test";
import { BaseTest } from "../basetest";

export class Headers extends BaseTest {
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutLink = page.getByRole("link", { name: "Logout" });
  }

  async clickOnLogout() {
    await this.logoutLink.click();
  }
}
