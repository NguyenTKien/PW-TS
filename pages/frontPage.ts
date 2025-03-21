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

  constructor(page: Page) {
    super(page);

    this.bookingButton = page.locator(
      "//button[@type='button']"
    ).filter({ hasText: "Book this room"});
    // this.bookingButton = page.locator("//button[text()='Book this room']");
    this.nameContactField = page.getByTestId("ContactName");
    this.emailContactField = page.getByTestId("ContactEmail");
    this.phoneContactField = page.getByTestId("ContactPhone");
    this.subjectContactField = page.getByTestId("ContactSubject");
    this.messageContactField = page.getByTestId("ContactDescription");
    this.submitButton = page.locator(".//button[@id='submitContact']");
    // this.firstnameBooking = page.locator(
    //   ".//input[contains(@class,'room-firstname')]"
    // );
    this.firstnameBooking = page.getByPlaceholder('Firstname');
    this.lastnameBooking = page.getByPlaceholder('Lastname');
    this.emailBooking = page.locator("//input[contains(@class,'room-email')]");
    this.phoneBooking = page.locator("//input[contains(@class,'room-phone')]");
    this.bookingRoomButton = page.locator(
      "//button[@type='button']"
    ).filter({ hasText: 'Book'});
    this.cancelRoomButton = page.locator(
        "//button[@type='button']"
      ).filter({ hasText: 'Cancel'});
    this.errorMessage = page.locator("//div[contains(@class,'alert-danger')]");
    this.listDateInMonth = page.locator("//div[@class ='rbc-row-bg']//div[@class ='rbc-day-bg']");
  }

  async selectBookingDate(checkinDate: number, checkoutDate: number) {
    const checkinCalendar = await this.page.locator("//div[@class ='rbc-row-bg']//div[@class ='rbc-day-bg']").nth(checkinDate - 1);
    console.log(checkinCalendar);
    const checkoutCalendar = await this.page.locator("//div[@class ='rbc-row-bg']//div[@class ='rbc-day-bg']").nth(checkoutDate - 1);
    console.log(checkoutCalendar);
    await checkinCalendar.dragTo(checkoutCalendar);
  }

  async makeARoomBooking(firstName: string, lastName: string, email: string, phone: string, checkin: number, checkout:number) {
    // await this.page.evaluate(() => window.scrollBy(0, 500));
    
    await this.bookingButton.click();
    await this.firstnameBooking.fill(firstName);
    await this.lastnameBooking.fill(lastName);
    await this.emailBooking.fill(email);
    await this.phoneBooking.fill(phone);
    await this.selectBookingDate(checkin, checkout);
    // await this.listDateInMonth.first().dragTo(this.listDateInMonth.last());
    await this.page.waitForTimeout(3000);

    await this.bookingRoomButton.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(3000);
  }
  
  async waitForFrontPage() {
    await this.page.goto("/");
    expect(await this.page.title()).toBe("Restful-booker-platform demo");
  }
}
