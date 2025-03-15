import { Locator, Page } from "@playwright/test";
import { BaseTest } from "../basetest";
import { link } from "fs";

export class Headers extends BaseTest {
  readonly logoutLink: Locator;
  readonly roomsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutLink = page.getByRole("link", { name: "Logout" });
    this.roomsLink = page.getByRole("link", { name: "Rooms" });

  }

  async clickOnHeaderLink(linkName: string) {
    const headerLink = this.page.getByRole("link", { name: linkName});
    const reportLink = this.page.locator("//a[text()='Report']");
    await headerLink.click();
  }
}
