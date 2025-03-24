import { BrowserContext, Locator, Page } from "@playwright/test";

export class BasePage {
  readonly page;

  constructor(page: Page) {
    this.page = page;
  }

  async hideBanner(baseUrl: string | undefined) {
    await this.page.context().addCookies([
      {
        name: "banner",
        value: "true",
        url: baseUrl ? baseUrl : "/",
        sameSite: "Strict",
      },
    ]);
  }

  async selectItemInDropdown<T>(optionKey: T, prefix: string = "select-option-") {
    await this.page.getByTestId(`${prefix}${optionKey}`).click();
  }

  async waitUntilNewPageLoads(context: BrowserContext, element: Locator) {
    const pagePromise = context.waitForEvent('page');
    await element.click();
    const newPage = await pagePromise;
    return newPage;
  }

  async getListMessage(locator: Locator): Promise<string[]> {
    const listText: string[] = [];
    const elements = await locator.elementHandles();
    for (const element of elements) {
      const text = await element.textContent();
      if (text) {
        listText.push(text);
      }
    }
    return listText;
  };
}