import { Headers } from "../../pages/Components/headers";
import { expect, test } from "@playwright/test";
import { BookingPage } from "../../pages/bookingPage";
import { LoginPage } from "../../common/login_page";
import { updateRoomBooking } from "../../utils/data_helper";
import { getExtendImages } from "../../utils/helper";
import { getAmenitiesAsList } from "../../pages/roomPage";

test.describe("Test Booking Managerment Fuctions", () => {
  let loginPage: LoginPage;
  let header: Headers;
  let bookingPage: BookingPage;

  test.beforeEach(
    "Access to booking managerment",
    async ({ page }) => {
      loginPage = new LoginPage(page);
      header = new Headers(page);
      bookingPage = new BookingPage(page);
    }
  );

  test.only("auth @sanity", async ({ page }) => {
    await loginPage.openURL("/admin");
    console.log(process.env.BASE_API_URL + '/room');
    // const response = await page.request.get(process.env.BASE_API_URL + '/room', { timeout: 0 });
    // console.log(JSON.parse(await response.text()));
    const createResponse = await page.request.post('https://automationintesting.online/api/room', {
      data: {
        roomName: updateRoomBooking.roomName,
        type: updateRoomBooking.type,
        accessible: updateRoomBooking.accesssible,
        roomPrice: updateRoomBooking.price,
        image: getExtendImages(updateRoomBooking.type),
        features: getAmenitiesAsList(updateRoomBooking.roomAmenities),
        description: "Room Created with Automated Test"
      }, timeout: 0
    })

    expect(createResponse.status()).toBe(200);

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
