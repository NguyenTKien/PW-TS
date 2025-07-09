import { expect } from "@playwright/test"
import { bookingcheck, defaultRoomBooking, user } from "../../../utils/data_helper"
import { bookingPath } from "../../apis/bookingApi"
import { test } from "../../base/api_fixtures"
import { readJsonData } from "../../../utils/helper"
import path from "path"

let roomid: number
const jsonFilePath = path.resolve(__dirname, "../../../utils/data.json")
const json = readJsonData(jsonFilePath)

test.beforeAll(" Set up create room", async ({ roomApi }) => {
    await roomApi.createRoom({
        roomname: defaultRoomBooking.roomname,
        type: defaultRoomBooking.type,
        accessible: defaultRoomBooking.accessible,
        roomPrice: defaultRoomBooking.roomPrice,
        features: defaultRoomBooking.features,
    })
    roomid = await roomApi.getfirstRoomID()
})

test.describe("POST booking room", async () => {
    test("POST booking room with correct info", async ({ bookingApi }) => {
        const response = await bookingApi.postBookingRoom(
            roomid,
            user.firstname,
            user.lastname,
            user.email,
            user.phone,
            bookingcheck.depositpaid,
            bookingcheck.checkin,
            bookingcheck.checkout,
        )
        await bookingApi.VerifyReturnStatus(response, 200)
        const roomIdString = roomid.toString()
        const responseGetRoom = await bookingApi.request.get(bookingPath + `?roomid=${roomIdString}`)
        const responseJson = await responseGetRoom.json()
        const roomData = await responseJson.bookings[0]
        expect(roomData.roomid).toEqual(roomid)
        expect(roomData.firstname).toEqual(user.firstname)
        expect(roomData.lastname).toEqual(user.lastname)
        expect(roomData.depositpaid).toEqual(bookingcheck.depositpaid)
        expect(roomData.bookingdates.checkin).toEqual(bookingcheck.checkin)
        expect(roomData.bookingdates.checkout).toEqual(bookingcheck.checkout)
    })

    test("POST booking room with missing body", async ({ bookingApi }) => {
        const response = await bookingApi.request.post(bookingPath, {
            data: {},
        })
        await bookingApi.VerifyReturnStatus(response, 400)
        const responseBody = await response.json()
        const resultErrors = await json.bookingErrors.sort()
        expect(await responseBody.errors.sort()).toEqual(resultErrors)
    })

    test("Update booking room with checkout sooner than checkin", async ({ bookingApi }) => {
        const response = await bookingApi.postBookingRoom(
            roomid,
            user.firstname,
            user.lastname,
            user.email,
            user.phone,
            bookingcheck.depositpaid,
            bookingcheck.checkout,
            bookingcheck.checkin,
        )
        await bookingApi.VerifyReturnStatus(response, 500)
        await bookingApi.VerifyResponseToContainText(response, "")
    })
})
