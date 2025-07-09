import { expect } from "@playwright/test"
import { bookingcheck, defaultRoomBooking, user } from "../../../utils/data_helper"
import { bookingPath } from "../../apis/bookingApi"
import { test } from "../../base/api_fixtures"
import schemaGetRoom from "../../api-schemes/bookings/GET-booking-schema.json"
import { STORAGE_STATE_PATH } from "../../../playwright.config"

test.describe("GET booking room with success response", () => {
    let roomId: number
    test.beforeAll("Create a booking", async ({ roomApi, bookingApi }) => {
        await roomApi.createRoom({
            roomname: defaultRoomBooking.roomname,
            type: defaultRoomBooking.type,
            accessible: defaultRoomBooking.accessible,
            roomPrice: defaultRoomBooking.roomPrice,
            features: defaultRoomBooking.features,
        })
        // Get the roomId
        roomId = await roomApi.getfirstRoomID()
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
    })

    test("GET booking with correct schmema", async ({ bookingApi }) => {
        const roomIdString = roomId.toString()
        const response = await bookingApi.request.get(bookingPath + `?roomid=${roomIdString}`)
        await bookingApi.VerifyReturnStatus(response, 200)
        await bookingApi.ValidateSchema(response, schemaGetRoom)
    })

    test("GET booking with correct info", async ({ bookingApi }) => {
        const roomIdString = roomId.toString()
        const response = await bookingApi.request.get(bookingPath + `?roomid=${roomIdString}`)
        const responseJson = await response.json()
        const roomData = await responseJson.bookings[0]
        expect(roomData.roomid).toEqual(roomId)
        expect(roomData.firstname).toEqual(user.firstname)
        expect(roomData.lastname).toEqual(user.lastname)
        expect(roomData.depositpaid).toEqual(bookingcheck.depositpaid)
        expect(roomData.bookingdates.checkin).toEqual(bookingcheck.checkin)
        expect(roomData.bookingdates.checkout).toEqual(bookingcheck.checkout)
    })
})

test.describe("GET booking room with error message", () => {
    test.use({ storageState: STORAGE_STATE_PATH + process.env.STORAGE_STATE_ADMIN_FILE })
    test("GET booking room with missing token", async ({ bookingApi }) => {
        const response = await bookingApi.request.get(bookingPath + `?roomid=1`)
        await bookingApi.VerifyReturnStatus(response, 401)
        await bookingApi.VerifyResponseToContainText(response, "Authentication required")
    })

    test("GET booing room with invalid token", async ({ bookingApi }) => {
        const response = await bookingApi.request.get(bookingPath + `?roomid=1`, {
            headers: {
                Cookie: `token=3EzibFfNob8Vyg4I`,
            },
        })
        await bookingApi.VerifyReturnStatus(response, 500)
        await bookingApi.VerifyResponseToContainText(response, "")
    })
})
