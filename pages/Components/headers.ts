import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../basePage";

export class Headers extends BasePage {
  readonly logoutLink: Locator;
  readonly roomsLink: Locator;
  readonly badgeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutLink = page.getByRole("link", { name: "Logout" });
    this.roomsLink = page.getByRole("link", { name: "Rooms" });
    this.badgeMessage = page.locator("//div[@id='navbarSupportedContent']//span");
  }

  async clickOnHeaderLink(linkName: string) {
    const headerLink = this.page.getByRole("link", { name: linkName});
    await headerLink.click();
  }

  async verifyNotificationMessageDislayed() {
    await this.badgeMessage.waitFor({ state: "visible" });
    expect (await this.badgeMessage.textContent()).toEqual("1");
  }
}
