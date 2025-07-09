import { expect, Locator, Page } from "@playwright/test"
import { BasePage } from "./basePage"

export class MessagePage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async waitForMessagePage() {
    await this.page.goto("/admin/message")
    expect(await this.page.title()).toBe("Restful-booker-platform demo")
  }

  async getMessageNameLocator<T>(optionKey: T, prefix: string = "message"): Promise<Locator> {
    return this.page.locator(`//div[@data-testid='${prefix}${optionKey}']/p`)
  }

  async getMessageSubjectLocator(optionKey: string): Promise<Locator> {
    return this.page.locator(`//div[@data-testid='messageDescription${optionKey}']/p`)
  }

  async verifyMessageDisplayCorrectly(username: string, subject: string) {
    const messageName = (await this.getMessageNameLocator("0")).textContent()
    const messageSubject = (await this.getMessageSubjectLocator("0")).textContent()
    await this.page.goto("/admin/message")
    await (await this.getMessageNameLocator("0")).waitFor({ state: "visible" })

    expect(await messageName).toContain(username)
    expect(await messageSubject).toEqual(subject)
  }
}
