import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator("//input[@id='username']");
    this.passwordField = page.locator("//input[@id='password']");
    this.loginButton = page.locator("//button[@type='submit']");
  }

  async signIn(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async openURL(URL: string) {
    await this.page.goto(URL);
    await this.page.waitForURL(URL);
    await this.page.waitForLoadState("load");
  }
}
