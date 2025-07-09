import { expect, Locator, Page } from "@playwright/test"
import { BasePage } from "../basePage"
import { isLastDateOfMonth } from "../../utils/helper"

export class FrontPage extends BasePage {
  readonly bookingButton: Locator
  readonly nameContactField: Locator
  readonly emailContactField: Locator
  readonly phoneContactField: Locator
  readonly subjectContactField: Locator
  readonly messageContactField: Locator
  readonly submitButton: Locator
  readonly bookingRoomButton: Locator
  readonly errorMessage: Locator
  readonly listDateInMonth: Locator
  readonly bookingSuccessTitle: Locator
  readonly bookingSuccessContent: Locator
  readonly bookingSuccessDate: Locator
  readonly closeBookingPopup: Locator
  readonly requestSuccessTitle: Locator
  readonly requestMessageSuccess: Locator
  readonly body: Locator
  readonly checkInField: Locator
  readonly checkOutField: Locator
  readonly checkAvailabilityButton: Locator

  constructor(page: Page) {
    super(page)

    this.checkInField = page
      .locator("div")
      .filter({ hasText: /^Check In$/ })
      .getByRole("textbox")
    this.checkOutField = page
      .locator("div")
      .filter({ hasText: /^Check Out$/ })
      .getByRole("textbox")
    this.checkAvailabilityButton = page.getByRole("button", { name: "Check Availability" })

    this.body = page.locator("//div[@id='root-container']")
    this.bookingButton = page.locator("//section[@id='rooms']//a").and(page.getByText("Book now"))
    this.nameContactField = page.getByTestId("ContactName")
    this.emailContactField = page.getByTestId("ContactEmail")
    this.phoneContactField = page.getByTestId("ContactPhone")
    this.subjectContactField = page.getByTestId("ContactSubject")
    this.messageContactField = page.getByTestId("ContactDescription")
    this.submitButton = page.getByRole("button", { name: "Submit" })

    this.bookingRoomButton = page.locator("//button[@type='button']").filter({ hasText: "Book" })
    this.errorMessage = page.locator("//div[contains(@class,'alert-danger')]/p")
    this.listDateInMonth = page.locator("//div[@class ='rbc-row-bg']//div[@class ='rbc-day-bg']")
    this.bookingSuccessTitle = page.locator("//div[@class='form-row']//h3")
    this.bookingSuccessContent = page.locator("//div[@class='form-row']//p").first()
    this.bookingSuccessDate = page.locator("//div[@class='form-row']//p").last()
    this.closeBookingPopup = page.locator("//div[@class='form-row']//button")
    this.requestSuccessTitle = page.getByRole("heading", { name: "Thanks for getting in touch " })
    this.requestMessageSuccess = page.locator("//section[@id='contact']//h3/following-sibling::p").first()
  }

  async fillDepositField(checkin: string, checkout: string): Promise<void> {
    await this.checkInField.waitFor({ state: "visible" })
    await this.checkInField.fill(checkin)
    await this.checkOutField.fill(checkout)
    await this.checkAvailabilityButton.click()
  }

  async selectRoomBooking(): Promise<void> {
    await this.bookingButton.waitFor({ state: "visible" })
    await this.bookingButton.click()
  }

  async getTheCheckoutDate(): Promise<Locator> {
    if (isLastDateOfMonth()) {
      return this.page.locator("//div[@class ='rbc-date-cell rbc-off-range']").last()
    }
    return this.page.locator("//div[@class ='rbc-row-bg']//div[@class ='rbc-day-bg']").last()
  }

  async selectBookingDate() {
    const checkinCalendar = this.page.locator("//div[@class ='rbc-row-bg']//div[@class ='rbc-day-bg']").first()
    const checkoutCalendar = await this.getTheCheckoutDate()
    await checkinCalendar.dragTo(checkoutCalendar)
  }

  async waitForFrontPage() {
    await this.page.goto("/")
    expect(await this.page.title()).toBe("Restful-booker-platform demo")
  }

  async verifyErrorMessage(errorMessage: string) {
    const elements = await this.getListMessage(this.errorMessage)
    expect(elements.includes(errorMessage))
    await this.page.waitForTimeout(1000)
  }

  async makeARequestMessage(name: string, email: string, phone: string, title: string, message: string) {
    await this.nameContactField.waitFor({ state: "visible" })

    await this.nameContactField.fill(name)
    await this.emailContactField.fill(email)
    await this.phoneContactField.fill(phone)
    await this.subjectContactField.fill(title)
    await this.messageContactField.fill(message)

    await this.submitButton.click()
  }

  async verifyRequestMessageSuccess(requestSuccessTitle: string, requestName: string, requestMessageTitle: string) {
    await this.requestSuccessTitle.waitFor({ state: "visible" })
    expect(await this.requestSuccessTitle.textContent()).toContain(requestSuccessTitle)
    expect(await this.requestSuccessTitle.textContent()).toContain(requestName)
    const getMessageSuccessContent = await this.getListMessage(this.requestMessageSuccess)
    expect(getMessageSuccessContent.includes(requestMessageTitle))
  }
}
