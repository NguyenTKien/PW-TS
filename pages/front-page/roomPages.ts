import { expect, Locator, Page } from "@playwright/test"
import { BasePage } from "../basePage"

export class RoomsPage extends BasePage {
    readonly roomTitle: Locator
    readonly reserveButton: Locator
    readonly firstnameBooking: Locator
    readonly lastnameBooking: Locator
    readonly emailBooking: Locator
    readonly phoneBooking: Locator
    readonly bookingSuccessTitle: Locator
    readonly bookingSuccessContent: Locator
    readonly returnHomeButton: Locator
    readonly cancelRoomButton: Locator
    readonly confirmDate: Locator

    constructor(page: Page) {
        super(page)

        this.roomTitle = page.locator("//h1").filter({ hasText: "Room" })
        this.reserveButton = page.getByRole("button", { name: "Reserve Now" })
        this.firstnameBooking = page.getByPlaceholder("Firstname")
        this.lastnameBooking = page.getByPlaceholder("Lastname")
        this.emailBooking = page.locator("//input[contains(@class,'room-email')]")
        this.phoneBooking = page.locator("//input[contains(@class,'room-phone')]")
        this.bookingSuccessTitle = page.getByRole("heading", { name: "Booking Confirmed" })
        this.bookingSuccessContent = page.getByText("Your booking has been")
        this.returnHomeButton = page.getByRole("link", { name: "Return home" })
        this.cancelRoomButton = page.locator("//button[@type='button']").filter({ hasText: "Cancel" })
        this.confirmDate = page.locator("//div[@class='card-body']//p/strong")
    }

    async verifyRoomTitleDisplayedCorrectly() {
        await this.roomTitle.waitFor({ state: "visible" })
        expect(await this.roomTitle.textContent()).toContain("Room")
    }

    async makeARoomBooking(firstName: string, lastName: string, email: string, phone: string) {
        await this.reserveButton.click()

        await this.firstnameBooking.waitFor({ state: "visible" })
        await this.firstnameBooking.fill(firstName)
        await this.lastnameBooking.fill(lastName)
        await this.emailBooking.fill(email)
        await this.phoneBooking.fill(phone)
        await this.reserveButton.click()
    }

    async verifyDialogBookingSuccessed(
        bookingTitle: string,
        bookingContent: string,
        checkinDate: string,
        checkoutDate: string,
    ) {
        await this.page.waitForLoadState("domcontentloaded")
        // await this.page.waitForTimeout(3000)
        await this.bookingSuccessTitle.waitFor({ state: "visible" })

        expect(this.bookingSuccessTitle).toContainText(bookingTitle)
        expect(this.bookingSuccessContent).toContainText(bookingContent)
        expect(await this.confirmDate.textContent()).toEqual(`${checkinDate} - ${checkoutDate}`)

        await this.returnHomeButton.click()
    }
}
