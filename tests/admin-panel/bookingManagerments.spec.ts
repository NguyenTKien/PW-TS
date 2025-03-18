import { Headers } from "../../pages/Components/headers";
import { expect, test } from "@playwright/test";
import { BookingPage } from "../../pages/bookingPage";
import { LoginPage } from "../../common/login_page";
import {
  bookingcheck,
  bookingcheckupdate,
  user,
  userupdate,
} from "../../utils/data_helper";
import { RoomPage } from "../../pages/roomPage";
import { BookingApi } from "../../apis/bookingApi";

test.describe("Test Booking Managerment Fuctions", () => {
  let loginPage: LoginPage;
  let header: Headers;
  let bookingPage: BookingPage;
  let bookingApi: BookingApi;
  let roomPage: RoomPage;

  test.beforeEach(
    "Access to booking managerment",
    async ({ page, request }) => {
      loginPage = new LoginPage(page);
      header = new Headers(page);
      bookingPage = new BookingPage(page);
      bookingApi = new BookingApi(request);
      roomPage = new RoomPage(page);
      // Delete all booking in the first room
      const roomId = await bookingApi.getfirstRoomID();
      await bookingApi.deleteAllBookingsInFirstRoom(roomId.toString());
      // Create a booking in the first room
      await bookingApi.createBooking(
        roomId,
        user.email,
        user.firstname,
        user.lastname,
        user.phone,
        bookingcheck.depositpaid,
        bookingcheck.bookingdates.checkin,
        bookingcheck.bookingdates.checkout
      );
      await loginPage.openURL("/admin");
    }
  );

  test("The adminitration user is able to edit the booking room @booking-managerment @sanity", async ({
    page,
  }) => {
    console.log(process.env.BASE_API_URL + "/room");
    const roomRecord = roomPage.getRoomRecord("101");
    await roomPage.getRoomNameLocator(roomRecord).click();

    await roomPage.clickToUpdateBooking();
    await roomPage.updateBookingRoom(
      userupdate.firstname,
      userupdate.lastname,
      bookingcheckupdate.bookingdates.checkin,
      bookingcheckupdate.bookingdates.checkout,
      bookingcheckupdate.depositpaid
    );
    await roomPage.clickToConfirmUpdateBooking();

    await roomPage.verifyBookingHasUpdated(
      userupdate.firstname,
      userupdate.lastname,
      bookingcheckupdate.bookingdates.checkin,
      bookingcheckupdate.bookingdates.checkout
    );
  });

  test("The adminitration user is able to delete the booking room @booking-managerment @sanity ", async ({
    page,
  }) => {
    const roomRecord = roomPage.getRoomRecord("101");
    await roomPage.getRoomNameLocator(roomRecord).click();

    await roomPage.clickToDeleteBooking();
    await roomPage.verifyBookingHasDeleted();
  });
});
