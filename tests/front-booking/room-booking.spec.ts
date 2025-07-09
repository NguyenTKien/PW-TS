import path from "path"
import { MessageApi } from "../../api-tests/apis/messageApi"
import { RoomApi } from "../../api-tests/apis/roomApi"
import { test } from "../../base/custom_fixtures"
import { bookingcheck, BookingSucces, defaultRoomBooking, user } from "../../utils/data_helper"
import { formatDate, readJsonData } from "../../utils/helper"

let roomApi: RoomApi
let messageApi: MessageApi

const jsonFilePath = path.resolve(__dirname, "../../utils/data.json")
const data = readJsonData(jsonFilePath)
const checkinDate = formatDate(bookingcheck.checkin)
const checkoutDate = formatDate(bookingcheck.checkout)

test.describe("Booking room function", async () => {
    test.beforeEach("Set up room", async ({ request, frontPage, roomsPage }) => {
        roomApi = new RoomApi(request)
        messageApi = new MessageApi(request)

        roomApi.createRoom({
            roomname: defaultRoomBooking.roomname,
            type: defaultRoomBooking.type,
            accessible: defaultRoomBooking.accessible,
            roomPrice: defaultRoomBooking.roomPrice,
            features: defaultRoomBooking.features,
        })
        await frontPage.fillDepositField(checkinDate, checkoutDate)
        await frontPage.selectRoomBooking()
        await roomsPage.verifyRoomTitleDisplayedCorrectly()
    })

    test("Booking Room function @front-page @sanity", async ({ messagePage, headerPage, roomsPage }) => {
        await messageApi.deleteAllMessage()

        await roomsPage.makeARoomBooking(user.firstname, user.lastname, user.email, user.phone)
        await roomsPage.verifyDialogBookingSuccessed(
            BookingSucces.BookingTitle,
            BookingSucces.BookingContent,
            bookingcheck.checkin,
            bookingcheck.checkout,
        )

        await messagePage.verifyMessageDisplayCorrectly(user.firstname, "You have a new booking!")
        await headerPage.verifyNotificationMessageDislayed()
    })

    /* Test cases:
          - Error message when leave the first name blank
          - Error message when leave the last name blank
          - Error message when leave the email name blank
          - Error message when leave the phone name blank
          - Error message when empty select booking date
          - Error message when inputting invalid first name field
          - Error message when inputting invalid last name field
          - Error message when inputting invalid email format field
          - Error message when inputting invalid phone field
         */
    test("Error message when inputing invalid booking information @front-page", async ({ frontPage, roomsPage }) => {
        await roomsPage.makeARoomBooking(
            "", //Empty field
            user.lastname,
            user.email,
            user.phone,
        )
        await frontPage.verifyErrorMessage(data.errorMessage.leaveFirstnameBlank)

        await roomsPage.cancelRoomButton.click()
        await roomsPage.makeARoomBooking(
            "ab", // Invalid input field
            user.lastname,
            user.email,
            user.phone,
        )
        await frontPage.verifyErrorMessage(data.errorMessage.between3and18characters)

        await roomsPage.cancelRoomButton.click()
        await roomsPage.makeARoomBooking(
            user.firstname,
            "", //Empty field
            user.email,
            user.phone,
        )
        await frontPage.verifyErrorMessage(data.errorMessage.leaveLastnameBlank)

        await roomsPage.cancelRoomButton.click()
        await roomsPage.makeARoomBooking(
            user.firstname,
            "ab", //Invalid field input
            user.email,
            user.phone,
        )
        await frontPage.verifyErrorMessage(data.errorMessage.between3and18characters)

        await roomsPage.cancelRoomButton.click()
        await roomsPage.makeARoomBooking(
            user.firstname,
            user.lastname,
            "", //Empty field
            user.phone,
        )
        await frontPage.verifyErrorMessage(data.errorMessage.errorNoInput)

        await roomsPage.cancelRoomButton.click()
        await roomsPage.makeARoomBooking(
            user.firstname,
            user.lastname,
            "emailNoValid", //Invalid field input
            user.phone,
        )
        await frontPage.verifyErrorMessage(data.errorMessage.invalidEmailFormat)

        await roomsPage.cancelRoomButton.click()
        await roomsPage.makeARoomBooking(
            user.firstname,
            user.lastname,
            user.email,
            "", //Empty field
        )
        await frontPage.verifyErrorMessage(data.errorMessage.phoneEmpty)

        await roomsPage.cancelRoomButton.click()
        await roomsPage.makeARoomBooking(
            user.firstname,
            user.lastname,
            user.email,
            "09334567", // Invalid field input
        )
        await frontPage.verifyErrorMessage(data.errorMessage.between11and21characters)

        await roomsPage.cancelRoomButton.click()
        await roomsPage.makeARoomBooking(user.firstname, user.lastname, user.email, user.phone)
        await frontPage.verifyErrorMessage(data.errorMessage.errorNoInput)
    })
})
