import { Page } from "@playwright/test";

export class BaseTest {
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
}
