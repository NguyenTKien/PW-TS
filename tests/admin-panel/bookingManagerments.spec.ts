import { test } from "../../base/custom_fixtures"
import { LoginPage } from "../../common/login_page"
import { bookingcheck, bookingcheckupdate, defaultRoomBooking, user, userupdate } from "../../utils/data_helper"
import { BookingApi } from "../../api-tests/apis/bookingApi"
import { RoomApi } from "../../api-tests/apis/roomApi"
import { formatDate } from "../../utils/helper"

const checkinDate = formatDate(bookingcheckupdate.bookingdates.checkin)
const checkoutDate = formatDate(bookingcheckupdate.bookingdates.checkout)

test.describe("Test Booking Managerment Fuctions", () => {
  let loginPage: LoginPage
  let bookingApi: BookingApi
  let roomApi: RoomApi

  test.beforeEach("Access to booking managerment", async ({ page, request, roomPage }) => {
    loginPage = new LoginPage(page)
    bookingApi = new BookingApi(request)
    roomApi = new RoomApi(request)
    //Create a room
    await roomApi.createRoom({
      roomname: defaultRoomBooking.roomname,
      type: defaultRoomBooking.type,
      accessible: defaultRoomBooking.accessible,
      roomPrice: defaultRoomBooking.roomPrice,
      features: defaultRoomBooking.features,
    })
    // Get the roomId
    const roomId = await roomApi.getfirstRoomID()
    // await bookingApi.deleteAllBookingsInFirstRoom(roomId.toString());
    // Create a booking in the first room
    await bookingApi.createBooking(
      {
        roomid: roomId,
        checkin: bookingcheck.checkin,
        checkout: bookingcheck.checkout,
        depositpaid: bookingcheck.depositpaid,
      },
      { email: user.email, firstname: user.firstname, lastname: user.lastname, phone: user.phone },
    )
    await loginPage.openURL("/admin")

    const roomRecord = roomPage.getRoomRecord(defaultRoomBooking.roomname ?? "102")
    await roomPage.getRoomNameLocator(roomRecord).click()
  })

  test("The adminitration user is able to edit the booking room @booking-managerment @sanity", async ({ roomPage }) => {
    console.log(process.env.BASE_API_URL + "/room")

    await roomPage.clickToUpdateBooking()
    await roomPage.updateBookingRoom(
      userupdate.firstname,
      userupdate.lastname,
      checkinDate,
      checkoutDate,
      bookingcheckupdate.depositpaid
    )
    await roomPage.clickToConfirmUpdateBooking()

    await roomPage.verifyBookingHasUpdated(
      userupdate.firstname,
      userupdate.lastname,
      bookingcheckupdate.bookingdates.checkin,
      bookingcheckupdate.bookingdates.checkout,
    )
  })

  test("The adminitration user is able to delete the booking room @booking-managerment @sanity ", async ({
    roomPage,
  }) => {
    await roomPage.clickToDeleteBooking()
    await roomPage.verifyBookingHasDeleted()
  })
})
