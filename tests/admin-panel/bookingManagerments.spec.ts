import { Headers } from "../../pages/Components/headers";
import { expect, test } from "@playwright/test";
import { BookingPage } from "../../pages/bookingPage";
import { LoginPage } from "../../common/login_page";
import { updateRoomBooking } from "../../utils/data_helper";
import { getExtendImages } from "../../utils/helper";
import { getAmenitiesAsList } from "../../pages/roomPage";
import { Room } from "../../common/interfaces";
import { BookingApi } from "../../apis/bookingApi";

test.describe("Test Booking Managerment Fuctions", () => {
  let loginPage: LoginPage;
  let header: Headers;
  let bookingPage: BookingPage;
  let bookingApi: BookingApi;

  test.beforeEach(
    "Access to booking managerment",
    async ({ page, request }) => {
      loginPage = new LoginPage(page);
      header = new Headers(page);
      bookingPage = new BookingPage(page);
      bookingApi = new BookingApi(request);
    }
  );

  test.only("auth @sanity", async ({ page }) => {
    await loginPage.openURL("/admin");
    console.log(process.env.BASE_API_URL + '/room ========');
    const roomId = (await bookingApi.getfirstRoomID()).toString();
    bookingApi.deleteAllBookingsInFirstRoom(roomId);


    await header.clickOnHeaderLink("Report");
    await expect(bookingPage.bookingPage).toBeVisible();
    // await page.waitForTimeout(3000);
    await page
      .locator("//div[@class='rbc-date-cell'][string()='17']").click();
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
