import { expect, test } from "@playwright/test";
import { AdminPage } from "../../pages/adminPage";
import { Headers } from "../../pages/Components/headers";
import { getRoomDetailsFromAmenities, RoomPage } from "../../pages/roomPage";
import {
  RoomType,
  defaultRoomBooking,
  updateRoomBooking,
} from "../../utils/data_helper";

test.describe("Room Managerment function", () => {
  let adminPage: AdminPage;
  let header: Headers;
  let roomManager: RoomPage;

  test.beforeEach("Access to room managerment", async ({ page, baseURL }) => {
    adminPage = new AdminPage(page);
    header = new Headers(page);
    roomManager = new RoomPage(page);

    await adminPage.hideBanner(baseURL);
    await adminPage.openURL("/#/admin/");
    await adminPage.doLogin("admin", "password");
  });
  /*
     Verify the administration is able to create by fill up all mandatory fields
     Verify the administration is able to update by fill up all mandatory fields
     Verify the administration is able to delete by fill up all mandatory fields 
  */
  test(`Administration is able to create room by fill up all mandatory fields`, async ({
    page,
  }) => {
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

    //Edit the room
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
    await page.waitForTimeout(2000);
    await page.goto("/#/admin");

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
    await expect(listBookingRecord).toEqual(1);
  });

  // Add a test case to verify that an administrative user cannot create a room without a room name
  test("Administration user cannot create a room without a room name", async ({
    page,
  }) => {
    await roomManager.createRoom(
      "", // Empty room name/
      RoomType.DOUBLE,
      true,
      230,
      {
        wifi: true,
        TV: false,
        Radio: false,
        Refreshment: true,
        safe: true,
        views: false,
      }
    );

    // Check for an error message or validation
    const errorMessageLocator = roomManager.getErrorMessageLocator();
    const errorMessageText = await errorMessageLocator.textContent();
    await expect(errorMessageText).toEqual("Room name must be set");
  });

  test("Administration user cannot create a room without setting room price", async ({
    page,
  }) => {
    await roomManager.createRoom(
      "108",
      RoomType.DOUBLE,
      true,
      null, // No room price set
      {
        wifi: true,
        TV: false,
        Radio: false,
        Refreshment: true,
        safe: true,
        views: false,
      }
    );

    // Check for an error message or validation
    const errorMessageLocator = roomManager.getErrorMessageLocator();
    const errorMessageText = await errorMessageLocator.textContent();
    await expect(errorMessageText).toEqual(
      "must be greater than or equal to 1"
    );
  });

  test.skip("Administration user create a room without selecting room amenities", async ({
    page,
  }) => {
    await roomManager.createRoom("109", RoomType.DOUBLE, true, 150, {
      wifi: false,
      TV: false,
      Radio: false,
      Refreshment: false,
      safe: false,
      views: false,
    });

    // Check for an no amenities message
    const noAmenitiesMessage = getRoomDetailsFromAmenities({
      wifi: false,
      TV: false,
      Radio: false,
      Refreshment: false,
      safe: false,
      views: false,
    });
    // const errorMessageText = await noAmenities.textContent();
    await expect(noAmenitiesMessage).toEqual(
      "At least one amenity No features added to the room be selected"
    );
  });
});
