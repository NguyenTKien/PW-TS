import { expect } from "@playwright/test"
import { test } from "../../base/api_fixtures"
import Ajv from "ajv"
import schema from "../../api-schemes/rooms/GET-room-schema.json"
import { defaultRoomBooking } from "../../../utils/data_helper"

test.describe("GET rooms api", async () => {
  const ajv = new Ajv()

  test("GET all rooms with valid schema", async ({ roomApi }) => {
    const response = await roomApi.getResponseRoom();

    expect(response.status()).toBe(200)
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
    await roomApi.createRoom(defaultRoomBooking.roomName, defaultRoomBooking.type, defaultRoomBooking.accessible, defaultRoomBooking.price, defaultRoomBooking.roomAmenities);

    const response = await roomApi.getResponseRoom();
    const responseBody = await response.json();
    console.log(responseBody);
    expect (responseBody.roomname).toEqual(defaultRoomBooking.roomName);
    expect (responseBody.type).toEqual(defaultRoomBooking.type);
    expect (responseBody.accessible).toEqual(defaultRoomBooking.accessible);
    expect (responseBody.price).toEqual(defaultRoomBooking.price);
    expect (responseBody.features).toEqual(defaultRoomBooking.roomAmenities);
  })
})