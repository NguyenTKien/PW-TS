import { expect } from "@playwright/test"
import { test } from "../../base/api_fixtures"
import Ajv from "ajv"
import schema from "../../api-schemes/rooms/GET-room-schema.json"
import schemaGetRoomId from "../../api-schemes/rooms/GET-room-id-schema.json"
import { defaultRoomBooking } from "../../../utils/data_helper"
import { STORAGE_STATE_PATH } from "../../../playwright.config"
import { roomPath } from "../../apis/roomApi"
import { getAmenitiesAsList } from "../../../pages/roomPage"

test.describe("GET rooms api", () => {
  const ajv = new Ajv();
  test.beforeEach("Create a room", async ({ roomApi }) => {
    await roomApi.createRoom(defaultRoomBooking.roomName, defaultRoomBooking.type, defaultRoomBooking.accessible, defaultRoomBooking.price, defaultRoomBooking.roomAmenities);
  })

  test("GET all rooms with valid schema", async ({ roomApi }) => {
    const response = await roomApi.getResponseRoom();
    const responseBody = await response.json()
    console.log(responseBody);
    // Validate response body against schema
    const validateSchema = ajv.compile(schema)
    const isValid = validateSchema(responseBody)
    // Assert schema validation
    if (!isValid) {
      console.error("Schema validation errors:", validateSchema.errors)
    }
    expect(isValid).toBeTruthy() // Ensure the response matches the schema
  })

  test("GET rooms with correct room info", async ({ roomApi }) => {
    const response = await roomApi.getResponseRoom();
    const responseBody = await response.json();
    const firstRoomData = await responseBody.rooms[0];
    console.log(await firstRoomData.roomName);

    expect(firstRoomData.roomName).toEqual(defaultRoomBooking.roomName);
    expect(firstRoomData.type).toEqual(defaultRoomBooking.type);
    expect(firstRoomData.accessible).toEqual(defaultRoomBooking.accessible);
    expect(firstRoomData.roomPrice).toEqual(defaultRoomBooking.price);
    expect(firstRoomData.features).toEqual(getAmenitiesAsList(defaultRoomBooking.roomAmenities));
  })

  test("GET specific room with correct info", async ({ roomApi, bookingApi }) => {
    const roomid = await bookingApi.getfirstRoomID();
    const response = await roomApi.request.get(roomPath + `/${roomid}`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const validateSchema = ajv.compile(schemaGetRoomId)
    const isValid = validateSchema(responseBody)
    // Assert schema validation
    if (!isValid) {
      console.error("Schema validation errors:", validateSchema.errors)
    }
    expect(isValid).toBeTruthy();
    const roomData = await responseBody.rooms[0];
    console.log(await roomData.roomName);

    expect(roomData.roomName).toEqual(defaultRoomBooking.roomName);
    expect(roomData.type).toEqual(defaultRoomBooking.type);
    expect(roomData.accessible).toEqual(defaultRoomBooking.accessible);
    expect(roomData.price).toEqual(defaultRoomBooking.price.toString());
    expect(roomData.features).toEqual(getAmenitiesAsList(defaultRoomBooking.roomAmenities));
  })
})

test.describe("GET room with invalid header", () => {
  test.use({ storageState: STORAGE_STATE_PATH + process.env.STORAGE_STATE_ADMIN_FILE });

  test("GET error in specific room when missing token", async ({ bookingApi, roomApi }) => {
    const roomid = await bookingApi.getfirstRoomID();
    const response = await roomApi.request.get(roomPath + `/${roomid}`);
    expect(response.status()).toBe(401);
    expect(await response.text()).toContain("Authentication required");
  })

  test("GET error in specific room when sending expired token", async ({ roomApi, bookingApi }) => {
    const roomid = await bookingApi.getfirstRoomID();
    const response = await roomApi.request.get(roomPath + `/${roomid}`);
    const responseBody = await response.json();
    expect(response.status()).toBe(500);
    expect(responseBody.status).toEqual(500);
    expect(responseBody.error).toEqual("Internal Server Error");
  })
});
