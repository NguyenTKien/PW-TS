import { Locator, Page } from "@playwright/test"
import { BasePage } from "../basePage"

export class AdminPage extends BasePage {
  readonly loginTitle: Locator
  readonly usernameField: Locator
  readonly passwordField: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    super(page)
    this.loginTitle = page.getByTestId("login-header")
    this.usernameField = page.locator("//input[@id='username']")
    this.passwordField = page.locator("//input[@id='password']")
    this.loginButton = page.locator("//button[@type='submit']")
    this.errorMessage = page.locator("//div[@role='alert'][text()='Invalid credentials']")
  }

  async openURL(url: string) {
    await this.page.goto(url)
  }

  async doLogin(username: string | undefined, password: string | undefined) {
    await this.usernameField.fill(username ?? "")
    await this.passwordField.fill(password ?? "")
    await this.loginButton.click()
  }
}
