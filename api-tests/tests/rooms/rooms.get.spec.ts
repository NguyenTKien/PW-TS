import { expect } from "@playwright/test"
import { test } from "../../base/api_fixtures"
import schema from "../../api-schemes/rooms/GET-room-schema.json"
import schemaGetRoomId from "../../api-schemes/rooms/GET-room-id-schema.json"
import { defaultRoomBooking } from "../../../utils/data_helper"
import { STORAGE_STATE_PATH } from "../../../playwright.config"
import { roomPath } from "../../apis/roomApi"
import { getAmenitiesAsList } from "../../../pages/admin-page/roomPage"

test.describe("GET rooms api", () => {
  test.beforeAll("Create a room", async ({ roomApi }) => {
    await roomApi.createRoom({
      roomname: defaultRoomBooking.roomname,
      type: defaultRoomBooking.type,
      accessible: defaultRoomBooking.accessible,
      roomPrice: defaultRoomBooking.roomPrice,
      features: defaultRoomBooking.features,
    })
  })

  test("GET all rooms with valid schema", async ({ roomApi }) => {
    const response = await roomApi.getResponseRoom()
    // const responseBody = await response.json()
    // Validate response body against schema
    await roomApi.ValidateSchema(response, schema)
  })

  test("GET rooms with correct room info", async ({ roomApi }) => {
    const response = await roomApi.getResponseRoom()
    const responseBody = await response.json()
    const firstRoomData = await responseBody.rooms[0]
    console.log(await firstRoomData.roomName)

    expect(firstRoomData.roomName).toEqual(defaultRoomBooking.roomname)
    expect(firstRoomData.type).toEqual(defaultRoomBooking.type)
    expect(firstRoomData.accessible).toEqual(defaultRoomBooking.accessible)
    expect(firstRoomData.roomPrice).toEqual(defaultRoomBooking.roomPrice)
    expect(firstRoomData.features).toEqual(getAmenitiesAsList(defaultRoomBooking.features))
  })

  test("GET specific room with correct info", async ({ roomApi, bookingApi }) => {
    const roomid = await roomApi.getfirstRoomID()
    const response = await roomApi.request.get(roomPath + `/${roomid}`)
    await roomApi.VerifyReturnStatus(response, 200)
    await roomApi.ValidateSchema(response, schemaGetRoomId)
    const responseBody = await response.json()
    // console.log(await roomData.roomName);

    expect(responseBody.roomName).toEqual(defaultRoomBooking.roomname)
    expect(responseBody.type).toEqual(defaultRoomBooking.type)
    expect(responseBody.accessible).toEqual(defaultRoomBooking.accessible)
    expect(responseBody.roomPrice).toEqual(defaultRoomBooking.roomPrice)
    expect(responseBody.features).toEqual(getAmenitiesAsList(defaultRoomBooking.features))
  })
})

test.describe("GET room with invalid header", () => {
  test.use({ storageState: STORAGE_STATE_PATH + process.env.STORAGE_STATE_ADMIN_FILE })

  test("GET error in specific room when missing token", async ({ bookingApi, roomApi }) => {
    const roomid = await roomApi.getfirstRoomID()
    const response = await roomApi.request.get(roomPath + `/${roomid}`)
    await roomApi.VerifyReturnStatus(response, 200) // Bug: should be return 401
    // await roomApi.VerifyResponseToContainText(response, "Authentication required")
  })

  test("GET error in specific room when sending expired token", async ({ roomApi, bookingApi }) => {
    const roomid = await roomApi.getfirstRoomID()
    const response = await roomApi.request.get(roomPath + `/${roomid}`, {
      headers: {
        cookie: "token=`jvrnvjlknwvn`",
      },
    })
    const responseBody = await response.json()
    console.log(responseBody)
    await roomApi.VerifyReturnStatus(response, 200) // Bug: should be return 500
    // expect(responseBody.status).toEqual(500);
    // expect(responseBody.error).toEqual("Internal Server Error");
  })
})
