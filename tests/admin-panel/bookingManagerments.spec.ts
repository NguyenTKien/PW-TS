import { Headers } from "../../pages/Components/headers";
import { expect, test } from "@playwright/test";
import { BookingPage } from "../../pages/bookingPage";
import { LoginPage } from "../../common/login_page";
import { bookingcheck, defaultBooking, defaultRoomBooking, updateRoomBooking, user } from "../../utils/data_helper";
import { getExtendImages } from "../../utils/helper";
import { getAmenitiesAsList, RoomPage } from "../../pages/roomPage";
import { BookingApi } from "../../apis/bookingApi";

test.describe("Test Booking Managerment Fuctions", () => {
  let loginPage: LoginPage;
  let header: Headers;
  let bookingPage: BookingPage;
  let bookingApi: BookingApi;
  let roomPage: RoomPage

  test.beforeEach(
    "Access to booking managerment",
    async ({ page, request }) => {
      loginPage = new LoginPage(page);
      header = new Headers(page);
      bookingPage = new BookingPage(page);
      bookingApi = new BookingApi(request);
      roomPage = new RoomPage(page);
    }
  );

  test.only("The adminitration user is able to edit the booking room @sanity", async ({ page }) => {
    await loginPage.openURL("/admin");
    console.log(process.env.BASE_API_URL + '/room ========');
    // Delete all booking in the first room
    const roomId = (await bookingApi.getfirstRoomID());
    await bookingApi.deleteAllBookingsInFirstRoom(roomId.toString());
    // Create a booking in the first room
    await bookingApi.createBooking(roomId, user.email, user.firstname, user.lastname, user.phone, bookingcheck.depositpaid, bookingcheck.bookingdates.checkin, bookingcheck.bookingdates.checkout);
    // Edit a booking
    const roomRecord = roomPage.getRoomRecord("101");
    await roomPage.getRoomNameLocator(roomRecord).click();

    await roomPage.clickToUpdateBooking();
    await roomPage.updateBookingRoom(user.firstname, user.lastname, bookingcheck.bookingdates.checkin, bookingcheck.bookingdates.checkout, bookingcheck.depositpaid);
    await roomPage.clickToConfirmUpdateBooking();
    // await header.clickOnHeaderLink("Report");
    // await expect(bookingPage.bookingPage).toBeVisible();
    await page.waitForTimeout(3000);
    // await page
    //   .locator("//div[@class='rbc-date-cell'][string()='17']").click();
  })


  test.skip("The administration is able to booking a room by fill up all mandatory fields @booking-managerment ", async ({
    page,
  }) => {
    // Test case 1
    const currentDateCalendar = await page.locator(
      "//div[@class='rbc-date-cell rbc-now rbc-today']//button[text() ='12']"
    );
    const futureDateCalendar = await page.locator(
      "//div[@class='rbc-date-cell']//button[text() ='14']"
    );
    // await (page.locator("//div[@class='rbc-date-cell']//button[text() ='13']")).dragTo(page.locator("//div[@class='rbc-date-cell']//button[text() ='14']"));
    await page
      // .locator("//div[@class='rbc-date-cell'][string()='17']")
      .locator('.rbc-day-bg:not(.rbc-off-range-bg)').first()
      .hover()
    // .then(() => {
    await page.mouse.down()
    // .then(() => {
    // await bookingPage.moveToElement(page, page.locator("//div[@class='rbc-date-cell'][string()='15']"));
    await page
      // .locator("//div[@class='rbc-date-cell'][string()='19']")
      .locator('.rbc-day-bg:not(.rbc-off-range-bg)').last()
      .hover()
    // .then(() => {
    await page.mouse.up();
    // });
    // });
    // });
    // await page.locator("//div[@class='rbc-date-cell']//button[text() ='14']").click();
    await page.waitForTimeout(5000);
    // await page.locator("//input[@name='firstname']")?.fill("John");
  });
});
