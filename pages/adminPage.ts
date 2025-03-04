import { expect, Locator, Page } from "@playwright/test";
import { BaseTest } from "./basetest";

export class AdminPage extends BaseTest {
  readonly loginTitle: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginTitle = page.getByTestId("login-header");
    this.usernameField = page.getByTestId("username");
    this.passwordField = page.getByTestId("password");
    this.loginButton = page.getByTestId("submit");
  }

  async openURL(url: string) {
    await this.page.goto(url);
    await expect(this.loginTitle, "Log into your account").toBeVisible();
  }

  async doLogin(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
    // await this.page.waitForTimeout(5000);
  }
}
