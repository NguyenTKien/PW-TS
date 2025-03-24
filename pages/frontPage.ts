import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class FrontPage extends BasePage {
  readonly bookingButton: Locator;
  readonly nameContactField: Locator;
  readonly emailContactField: Locator;
  readonly phoneContactField: Locator;
  readonly subjectContactField: Locator;
  readonly messageContactField: Locator;
  readonly submitButton: Locator;
  readonly firstnameBooking: Locator;
  readonly lastnameBooking: Locator;
  readonly emailBooking: Locator;
  readonly phoneBooking: Locator;
  readonly bookingRoomButton: Locator;
  readonly cancelRoomButton: Locator;
  readonly errorMessage: Locator;
  readonly listDateInMonth: Locator;
  readonly bookingSuccessTitle: Locator;
  readonly bookingSuccessContent: Locator;
  readonly bookingSuccessDate: Locator;
  readonly closeBookingPopup: Locator;
  readonly requestSuccessTitle: Locator;
  readonly requestMessageSuccess: Locator;

  constructor(page: Page) {
    super(page);

    this.bookingButton = page
      .locator("//button[@type='button']")
      .filter({ hasText: "Book this room" });
    this.nameContactField = page.getByTestId("ContactName");
    this.emailContactField = page.getByTestId("ContactEmail");
    this.phoneContactField = page.getByTestId("ContactPhone");
    this.subjectContactField = page.getByTestId("ContactSubject");
    this.messageContactField = page.getByTestId("ContactDescription");
    this.submitButton = page.locator("//button[@id='submitContact']");
    this.firstnameBooking = page.getByPlaceholder("Firstname");
    this.lastnameBooking = page.getByPlaceholder("Lastname");
    this.emailBooking = page.locator("//input[contains(@class,'room-email')]");
    this.phoneBooking = page.locator("//input[contains(@class,'room-phone')]");
    this.bookingRoomButton = page
      .locator("//button[@type='button']")
      .filter({ hasText: "Book" });
    this.cancelRoomButton = page
      .locator("//button[@type='button']")
      .filter({ hasText: "Cancel" });
    this.errorMessage = page.locator(
      "//div[contains(@class,'alert-danger')]/p"
    );
    this.listDateInMonth = page.locator(
      "//div[@class ='rbc-row-bg']//div[@class ='rbc-day-bg']"
    );
    this.bookingSuccessTitle = page.locator("//div[@class='form-row']//h3");
    this.bookingSuccessContent = page
      .locator("//div[@class='form-row']//p")
      .first();
    this.bookingSuccessDate = page
      .locator("//div[@class='form-row']//p")
      .last();
    this.closeBookingPopup = page.locator("//div[@class='form-row']//button");
    this.requestSuccessTitle = page.locator("//div[@class='row contact']//h2");
    this.requestMessageSuccess = page.locator("//div[@class='row contact']//h2/following-sibling::p");

  }

  async selectBookingDate(checkoutDate: number) {
    const checkinCalendar = await this.page
      .locator("//div[@class ='rbc-row-bg']//div[@class ='rbc-day-bg']")
      .first();
    console.log(checkinCalendar);
    const checkoutCalendar = await this.page
      .locator("//div[@class ='rbc-row-bg']//div[@class ='rbc-day-bg']")
      .nth(checkoutDate - 1);
    console.log(checkoutCalendar);
    await checkinCalendar.dragTo(checkoutCalendar);
  }

  async makeARoomBooking(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    checkout: number | null
  ) {
    // await this.page.evaluate(() => window.scrollBy(0, 500));
    await this.bookingButton.click();

    await this.firstnameBooking.fill(firstName);
    await this.lastnameBooking.fill(lastName);
    await this.emailBooking.fill(email);
    await this.phoneBooking.fill(phone);
    if (checkout !== undefined && checkout !== null) {
      await this.selectBookingDate(checkout);
    }
    await this.bookingRoomButton.click();
    // await this.page.waitForTimeout(1000);
  }

  async waitForFrontPage() {
    await this.page.goto("/");
    expect(await this.page.title()).toBe("Restful-booker-platform demo");
    // await this.page.waitForTimeout(2000);
  }

  async verifyDialogBookingSuccessed(
    bookingTitle: string,
    bookingContent: string,
    checkoutDate: string
  ) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(3000);

    expect(this.bookingSuccessTitle).toContainText(bookingTitle);
    expect(this.bookingSuccessContent).toContainText(bookingContent);
    expect(this.bookingSuccessDate).toContainText(checkoutDate);
    await this.closeBookingPopup.click();
  }

  async verifyErrorMessage(errorMessage: string) {
    const elements = await this.getListMessage(this.errorMessage);
    expect((elements).includes(errorMessage));
    await this.page.waitForTimeout(1000)
  }

  // async getListMessage(locator: Locator): Promise<string[]> {
  //   const listText: string[] = [];
  //   const elements = await locator.elementHandles();
  //   for (const element of elements) {
  //     const text = await element.textContent();
  //     if (text) {
  //       listText.push(text);
  //     }
  //   }
  //   return listText;
  // };
  
  async makeARequestMessage(name: string, email: string, phone: string, title: string, message: string) {
    await this.nameContactField.waitFor({ state: "visible" });

    await this.nameContactField.fill(name);
    await this.emailContactField.fill(email);
    await this.phoneContactField.fill(phone);
    await this.subjectContactField.fill(title);
    await this.messageContactField.fill(message);
    await this.submitButton.click();
  }

  async verifyRequestMessageSuccess(requestSuccessTitle: string, requestName: string, requestMessageTitle: string) {
    expect (await this.requestSuccessTitle.textContent()).toContain(requestSuccessTitle);
    expect (await this.requestSuccessTitle.textContent()).toContain(requestName);
    const getMessageSuccessContent = await this.getListMessage(this.requestMessageSuccess);
    expect ((getMessageSuccessContent).includes(requestMessageTitle));
  }
};
