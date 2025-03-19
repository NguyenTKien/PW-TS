import { test } from "../../base/custom_fixtures";
import { expect } from "@playwright/test";
import { getRoomDetailsFromAmenities, RoomPage } from "../../pages/roomPage";
import { defaultRoomBooking, updateRoomBooking } from "../../utils/data_helper";
import { AuthenticationApi } from "../../apis/authApi";
import { RoomApi } from "../../apis/roomApi";
import { readJsonData } from "../../utils/helper";
import path from "path";

test.describe("Room Managerment function", () => {
  let authApi: AuthenticationApi;
  let roomApi: RoomApi;
  const jsonFilePath = path.resolve(__dirname, '../../utils/data.json');
  const json = readJsonData(jsonFilePath);
  test.beforeEach("Access to room managerment", async ({ request }) => {
    authApi = new AuthenticationApi(request);
    roomApi = new RoomApi(request);
  });
  /*
     Verify the administration is able to create by fill up all mandatory fields
  */
  test(`Administration is able to create room by fill up all mandatory fields @room-managerment @sanity`, async ({
    roomPage,
  }) => {
    //Delete all rooms
    await roomApi.deleteAllRooms();

    // Create a room
    await roomPage.createRoom(
      defaultRoomBooking.roomName,
      defaultRoomBooking.type,
      defaultRoomBooking.accessible,
      defaultRoomBooking.price,
      defaultRoomBooking.roomAmenities
    );

    const Price = defaultRoomBooking.price.toString();
    const accessibleString = defaultRoomBooking.accessible.toString();
    const amenitiesString = getRoomDetailsFromAmenities(
      defaultRoomBooking.roomAmenities
    );
    const roomRecord = roomPage.getRoomRecord(defaultRoomBooking.roomName);

    // Verify the room details
    await expect(roomPage.getRoomNameLocator(roomRecord)).toContainText(
      defaultRoomBooking.roomName
    );
    await expect(roomPage.getRoomTypeLocator(roomRecord)).toContainText(
      defaultRoomBooking.type
    );
    await expect(
      roomPage.getRoomAccessibleLocator(roomRecord),
      `${defaultRoomBooking.roomName} has correct accessibility: ${accessibleString}`
    ).toContainText(accessibleString);
    await expect(
      roomPage.getRoomPriceLocator(roomRecord),
      `${defaultRoomBooking.roomName} has correct price: ${Price}`
    ).toContainText(Price);
    await expect(
      roomPage.getRoomDetailsLocator(roomRecord),
      `${defaultRoomBooking.roomName} has correct details: ${amenitiesString}`
    ).toContainText(amenitiesString);
  });

  /* 
  Verify the administration is able to update by fill up all mandatory fields
  Verify the administration is able to delete by fill up all mandatory fields 
  */
  test(`Administration is able to edit room by fill up all mandatory fields @room-managerment @sanity`, async ({
    page, roomPage,
  }) => {
    //Create the room by API
    await roomApi.createRoom(
      defaultRoomBooking.roomName,
      defaultRoomBooking.type,
      defaultRoomBooking.accessible,
      defaultRoomBooking.price,
      defaultRoomBooking.roomAmenities
    );
    await page.reload();
    //Edit the room
    const roomRecord = roomPage.getRoomRecord(defaultRoomBooking.roomName);

    await roomPage.getRoomNameLocator(roomRecord).click();
    await roomPage.getEditButtonLocator().click();
    await roomPage
      .getUpdateRoomValueLocator(defaultRoomBooking.roomName)
      .fill(updateRoomBooking.roomName);
    await roomPage
      .getUpdateSelectLocator("type")
      .selectOption(updateRoomBooking.type);
    await roomPage
      .getUpdateSelectLocator("accessible")
      .selectOption(updateRoomBooking.accessible ? "true" : "false");
    await roomPage
      .getUpdateRoomValueLocator(defaultRoomBooking.price.toString())
      .fill(updateRoomBooking.price.toString());
    await roomPage.selectRoomAmenities(updateRoomBooking.roomAmenities);
    await roomPage.clickToUpdateButton();

    const updatedRoomRecord = roomPage.getRoomRecord(
      updateRoomBooking.roomName
    );
    await expect(
      roomPage.getRoomNameLocator(updatedRoomRecord)
    ).toContainText(updateRoomBooking.roomName);
    await expect(
      roomPage.getRoomTypeLocator(updatedRoomRecord)
    ).toContainText(updateRoomBooking.type);
    await expect(
      roomPage.getRoomAccessibleLocator(updatedRoomRecord)
    ).toContainText(updateRoomBooking.accessible.toString());
    await expect(
      roomPage.getRoomPriceLocator(updatedRoomRecord)
    ).toContainText(updateRoomBooking.price.toString());
    await expect(
      roomPage.getRoomDetailsLocator(updatedRoomRecord)
    ).toContainText(
      getRoomDetailsFromAmenities(updateRoomBooking.roomAmenities)
    );
    // Delete the room
    await page.waitForLoadState("networkidle");
    await roomPage.clickToDeleteButton(updateRoomBooking.roomName);

    await page.waitForTimeout(3000);
    const listBookingRecord = await roomPage.getListRoomRecordCount();
    await expect(listBookingRecord).toEqual(0);
  });

  // Add a test case to verify that an administrative user cannot create a room without a room name
  test("Administration user cannot create a room without a room name @room-managerment @sanity", async ({
    roomPage,
  }) => {
    await roomPage.createRoom(
      "", // Empty room name/
      defaultRoomBooking.type,
      defaultRoomBooking.accessible,
      defaultRoomBooking.price,
      defaultRoomBooking.roomAmenities
    );

    // Check for an error message or validation
    const errorMessageLocator = roomPage.getErrorMessageLocator();
    const errorMessageText = await errorMessageLocator.textContent();
    await expect(errorMessageText).toEqual(json.errorMessage.errorRoomInput);
  });

  test("Administration user cannot create a room without setting room price @room-managerment", async ({
    roomPage,
  }) => {
    await roomPage.createRoom(
      defaultRoomBooking.roomName,
      defaultRoomBooking.type,
      defaultRoomBooking.accessible,
      null, // No room price set
      defaultRoomBooking.roomAmenities
    );

    // Check for an error message or validation
    const errorMessageLocator = roomPage.getErrorMessageLocator();
    const errorMessageText = await errorMessageLocator.textContent();
    await expect(errorMessageText).toEqual(
      json.errorMessage.errorValidInput
    );
  });

  test("Administration user cannot create a room with price is 0 @room-managerment", async ({
    roomPage,
  }) => {
    console.log(json.errorMessage.errorValidInput);
    await roomPage.createRoom(
      defaultRoomBooking.roomName,
      defaultRoomBooking.type,
      defaultRoomBooking.accessible,
      0, // Set price is 0
      defaultRoomBooking.roomAmenities
    );

    // Check for an no amenities message
    const noAmenitiesMessage = getRoomDetailsFromAmenities({
      wifi: false,
      TV: false,
      Radio: false,
      Refreshment: false,
      safe: false,
      views: false,
    });
    // Check for an error message or validation
    const errorMessageLocator = roomPage.getErrorMessageLocator();
    const errorMessageText = await errorMessageLocator.textContent();
    await expect(errorMessageText).toEqual(
      // "must be greater than or equal to 1"
      json.errorMessage.errorValidInput
    );
  });
});