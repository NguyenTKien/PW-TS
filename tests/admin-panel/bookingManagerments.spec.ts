import { test } from "../../base/custom_fixtures";
import { LoginPage } from "../../common/login_page";
import {
  bookingcheck,
  bookingcheckupdate,
  defaultRoomBooking,
  user,
  userupdate,
} from "../../utils/data_helper";
import { BookingApi } from "../../api-tests/apis/bookingApi";
import { RoomApi } from "../../api-tests/apis/roomApi";

test.describe("Test Booking Managerment Fuctions", () => {
  let loginPage: LoginPage;
  let bookingApi: BookingApi;
  let roomApi: RoomApi;

  test.beforeEach(
    "Access to booking managerment",
    async ({ page, request, roomPage }) => {
      loginPage = new LoginPage(page);
      bookingApi = new BookingApi(request);
      roomApi = new RoomApi(request);
      //Create a room
      await roomApi.createRoom(defaultRoomBooking.roomName,
            defaultRoomBooking.type,
            defaultRoomBooking.accessible,
            defaultRoomBooking.price,
            defaultRoomBooking.roomAmenities);
      // Get the roomId
      const roomId = await bookingApi.getfirstRoomID();
      // await bookingApi.deleteAllBookingsInFirstRoom(roomId.toString());
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

      const roomRecord = roomPage.getRoomRecord(defaultRoomBooking.roomName);
      await roomPage.getRoomNameLocator(roomRecord).click();
    }
  );

  test("The adminitration user is able to edit the booking room @booking-managerment @sanity", async ({
    roomPage,
  }) => {
    console.log(process.env.BASE_API_URL + "/room");
    // const roomRecord = roomPage.getRoomRecord("101");
    // await roomPage.getRoomNameLocator(roomRecord).click();

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
    roomPage,
  }) => {
    await roomPage.clickToDeleteBooking();
    await roomPage.verifyBookingHasDeleted();
  });
});
