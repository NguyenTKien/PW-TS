import { expect } from "@playwright/test"
import { bookingcheck, bookingcheckupdate, defaultRoomBooking, user, userupdate } from "../../../utils/data_helper"
import { test } from "../../base/api_fixtures"
import { bookingPath } from "../../apis/bookingApi"
import { STORAGE_STATE_PATH } from "../../../playwright.config"
import path from "path"
import { readJsonData } from "../../../utils/helper"

let roomid: number
let bookingid: number
const jsonFilePath = path.resolve(__dirname, "../../../utils/data.json")
const json = readJsonData(jsonFilePath)

test.beforeAll("Set up create booking room", async ({ roomApi, bookingApi }) => {
    await roomApi.createRoom({
        roomname: defaultRoomBooking.roomname,
        type: defaultRoomBooking.type,
        accessible: defaultRoomBooking.accessible,
        roomPrice: defaultRoomBooking.roomPrice,
        features: defaultRoomBooking.features,
    })
    roomid = await roomApi.getfirstRoomID()
    await bookingApi.createBooking(
        {
            roomid: roomid,
            checkin: bookingcheck.checkin,
            checkout: bookingcheck.checkout,
            depositpaid: bookingcheck.depositpaid,
        },
        { email: user.email, firstname: user.firstname, lastname: user.lastname, phone: user.phone },
    )
    bookingid = await bookingApi.getfirstBookingID(roomid)
})

test.describe("Update booking with valid token", async () => {
    test("Update booking room with correct info", async ({ bookingApi }) => {
        const response = await bookingApi.putBookingRoom(
            roomid,
            bookingid,
            userupdate.firstname,
            userupdate.lastname,
            bookingcheckupdate.depositpaid,
            bookingcheckupdate.bookingdates.checkin,
            bookingcheckupdate.bookingdates.checkout,
        )
        await bookingApi.VerifyReturnStatus(response, 200)
        const roomIdString = roomid.toString()
        const responseGetRoom = await bookingApi.request.get(bookingPath + `?roomid=${roomIdString}`)
        const responseJson = await responseGetRoom.json()
        const roomData = await responseJson.bookings[0]
        expect(roomData.roomid).toEqual(roomid)
        expect(roomData.bookingid).toEqual(bookingid)
        expect(roomData.firstname).toEqual(userupdate.firstname)
        expect(roomData.lastname).toEqual(userupdate.lastname)
        expect(roomData.depositpaid).toEqual(bookingcheckupdate.depositpaid)
        expect(roomData.bookingdates.checkin).toEqual(bookingcheckupdate.bookingdates.checkin)
        expect(roomData.bookingdates.checkout).toEqual(bookingcheckupdate.bookingdates.checkout)
    })

    test("Update booking room with missing body", async ({ bookingApi }) => {
        const response = await bookingApi.request.put(bookingPath + `/${bookingid}`, {
            data: {},
        })
        await bookingApi.VerifyReturnStatus(response, 400)
        const responseBody = await response.json()
        const resultErrors = await json.bookingErrors.sort()
        expect(await responseBody.fieldErrors.sort()).toEqual(resultErrors)
    })

    test("Update booking room with checkout sooner than checkin", async ({ bookingApi }) => {
        const response = await bookingApi.putBookingRoom(
            roomid,
            bookingid,
            user.firstname,
            user.lastname,
            bookingcheck.depositpaid,
            bookingcheck.checkout,
            bookingcheck.checkin,
        )
        await bookingApi.VerifyReturnStatus(response, 500)
        await bookingApi.VerifyResponseToContainText(response, "Failed to update booking")
    })
})

test.describe("Update booking room with error token", async () => {
    test.use({ storageState: STORAGE_STATE_PATH + process.env.STORAGE_STATE_ADMIN_FILE })

    test("Update booking room with missing token", async ({ bookingApi }) => {
        const response = await bookingApi.request.put(bookingPath + `/${bookingid}`, {
            data: {
                roomid: roomid,
                bookingid: bookingid,
                firstname: userupdate.firstname,
                lastname: userupdate.lastname,
                depositpaid: bookingcheckupdate.depositpaid,
                bookingdates: {
                    checkin: bookingcheckupdate.bookingdates.checkin,
                    checkout: bookingcheckupdate.bookingdates.checkout,
                },
            },
        })
        await bookingApi.VerifyReturnStatus(response, 401)
        await bookingApi.VerifyResponseToContainText(response, "Authentication required")
    })

    test("Update booking room with invalid token", async ({ bookingApi }) => {
        const response = await bookingApi.request.put(bookingPath + `/${bookingid}`, {
            headers: {
                cookie: `token=wkrnwevinlkm`,
            },
            data: {
                roomid: roomid,
                bookingid: bookingid,
                firstname: userupdate.firstname,
                lastname: userupdate.lastname,
                depositpaid: bookingcheckupdate.depositpaid,
                bookingdates: {
                    checkin: bookingcheckupdate.bookingdates.checkin,
                    checkout: bookingcheckupdate.bookingdates.checkout,
                },
            },
        })
        await bookingApi.VerifyReturnStatus(response, 500)
        await bookingApi.VerifyResponseToContainText(response, "Failed to update booking")
    })
})
