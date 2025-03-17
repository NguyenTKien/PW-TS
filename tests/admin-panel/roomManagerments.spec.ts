import { expect, test } from "@playwright/test";
import { AdminPage } from "../../pages/adminPage";
import { getRoomDetailsFromAmenities, RoomPage } from "../../pages/roomPage";
import { defaultRoomBooking, updateRoomBooking } from "../../utils/data_helper";
import { AuthenticationApi } from "../../apis/authApi";
import { RoomApi } from "../../apis/roomApi";

test.describe("Room Managerment function", () => {
  let adminPage: AdminPage;
  let roomManager: RoomPage;
  let authApi: AuthenticationApi;
  let roomApi: RoomApi;

  test.beforeEach("Access to room managerment", async ({ page, request }) => {
    adminPage = new AdminPage(page);
    roomManager = new RoomPage(page);

    authApi = new AuthenticationApi(request);
    roomApi = new RoomApi(request);

    await adminPage.openURL("/admin/");
  });
  /*
     Verify the administration is able to create by fill up all mandatory fields
  */
  test(`Administration is able to create room by fill up all mandatory fields @room-managerment @sanity`, async ({
    page,
  }) => {
    //Delete all rooms
    await roomApi.deleteAllRooms();

    // Create a room
    await roomManager.createRoom(
      defaultRoomBooking.roomName,
      defaultRoomBooking.type,
      defaultRoomBooking.accesssible,
      defaultRoomBooking.price,
      defaultRoomBooking.roomAmenities
    );

    const Price = defaultRoomBooking.price.toString();
    const accessibleString = defaultRoomBooking.accesssible.toString();
    const amenitiesString = getRoomDetailsFromAmenities(
      defaultRoomBooking.roomAmenities
    );
    const roomRecord = roomManager.getRoomRecord(defaultRoomBooking.roomName);

    // Verify the room details
    await expect(roomManager.getRoomNameLocator(roomRecord)).toContainText(
      defaultRoomBooking.roomName
    );
    await expect(roomManager.getRoomTypeLocator(roomRecord)).toContainText(
      defaultRoomBooking.type
    );
    await expect(
      roomManager.getRoomAccessibleLocator(roomRecord),
      `${defaultRoomBooking.roomName} has correct accessibility: ${accessibleString}`
    ).toContainText(accessibleString);
    await expect(
      roomManager.getRoomPriceLocator(roomRecord),
      `${defaultRoomBooking.roomName} has correct price: ${Price}`
    ).toContainText(Price);
    await expect(
      roomManager.getRoomDetailsLocator(roomRecord),
      `${defaultRoomBooking.roomName} has correct details: ${amenitiesString}`
    ).toContainText(amenitiesString);
  });

  /* 
  Verify the administration is able to update by fill up all mandatory fields
  Verify the administration is able to delete by fill up all mandatory fields 
  */
  test(`Administration is able to edit room by fill up all mandatory fields @room-managerment @sanity`, async ({
    page,
  }) => {
    //Create the room by API
    await roomApi.createRoom(
      defaultRoomBooking.roomName,
      defaultRoomBooking.type,
      defaultRoomBooking.accesssible,
      defaultRoomBooking.price,
      defaultRoomBooking.roomAmenities
    );
    await page.reload();
    //Edit the room
    const roomRecord = roomManager.getRoomRecord(defaultRoomBooking.roomName);

    await roomManager.getRoomNameLocator(roomRecord).click();
    await roomManager.getEditButtonLocator().click();
    await roomManager
      .getUpdateRoomValueLocator(defaultRoomBooking.roomName)
      .fill(updateRoomBooking.roomName);
    await roomManager
      .getUpdateSelectLocator("type")
      .selectOption(updateRoomBooking.type);
    await roomManager
      .getUpdateSelectLocator("accessible")
      .selectOption(updateRoomBooking.accesssible ? "true" : "false");
    await roomManager
      .getUpdateRoomValueLocator(defaultRoomBooking.price.toString())
      .fill(updateRoomBooking.price.toString());
    await roomManager.selectRoomAmenities(updateRoomBooking.roomAmenities);
    await roomManager.clickToUpdateButton();

    const updatedRoomRecord = roomManager.getRoomRecord(
      updateRoomBooking.roomName
    );
    await expect(
      roomManager.getRoomNameLocator(updatedRoomRecord)
    ).toContainText(updateRoomBooking.roomName);
    await expect(
      roomManager.getRoomTypeLocator(updatedRoomRecord)
    ).toContainText(updateRoomBooking.type);
    await expect(
      roomManager.getRoomAccessibleLocator(updatedRoomRecord)
    ).toContainText(updateRoomBooking.accesssible.toString());
    await expect(
      roomManager.getRoomPriceLocator(updatedRoomRecord)
    ).toContainText(updateRoomBooking.price.toString());
    await expect(
      roomManager.getRoomDetailsLocator(updatedRoomRecord)
    ).toContainText(
      getRoomDetailsFromAmenities(updateRoomBooking.roomAmenities)
    );
    // Delete the room
    await page.waitForLoadState("networkidle");
    await roomManager.clickToDeleteButton(updateRoomBooking.roomName);

    await page.waitForTimeout(3000);
    const listBookingRecord = await roomManager.getListRoomRecordCount();
    await expect(listBookingRecord).toEqual(0);
  });

  // Add a test case to verify that an administrative user cannot create a room without a room name
  test("Administration user cannot create a room without a room name @room-managerment @sanity", async ({
    page,
  }) => {
    await roomManager.createRoom(
      "", // Empty room name/
      defaultRoomBooking.type,
      defaultRoomBooking.accesssible,
      defaultRoomBooking.price,
      defaultRoomBooking.roomAmenities
    );

    // Check for an error message or validation
    const errorMessageLocator = roomManager.getErrorMessageLocator();
    const errorMessageText = await errorMessageLocator.textContent();
    await expect(errorMessageText).toEqual("Room name must be set");
  });

  test("Administration user cannot create a room without setting room price @room-managerment", async ({
    page,
  }) => {
    await roomManager.createRoom(
      defaultRoomBooking.roomName,
      defaultRoomBooking.type,
      defaultRoomBooking.accesssible,
      null, // No room price set
      defaultRoomBooking.roomAmenities
    );

    // Check for an error message or validation
    const errorMessageLocator = roomManager.getErrorMessageLocator();
    const errorMessageText = await errorMessageLocator.textContent();
    await expect(errorMessageText).toEqual(
      "must be greater than or equal to 1"
    );
  });

  test("Administration user cannot create a room with price is 0 @room-managerment", async ({
    page,
  }) => {
    await roomManager.createRoom(
      defaultRoomBooking.roomName,
      defaultRoomBooking.type,
      defaultRoomBooking.accesssible,
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
    const errorMessageLocator = roomManager.getErrorMessageLocator();
    const errorMessageText = await errorMessageLocator.textContent();
    await expect(errorMessageText).toEqual(
      "must be greater than or equal to 1"
    );
  });
});
