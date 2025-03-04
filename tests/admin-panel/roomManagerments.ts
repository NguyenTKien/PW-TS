import { expect, test } from "@playwright/test";
import { AdminPage } from "../../pages/adminPage";
import { Headers } from "../../pages/Components/headers";
import { RoomPage } from "../../pages/roomPage";
import { rooms } from "../../utils/test-data";

test("Room Managerment function", () => {
  let adminPage: AdminPage;
  let header: Headers;
  let roomManager: RoomPage;

  test.beforeEach("Access to room managerment", async ({ page }) => {
    adminPage = new AdminPage(page);
    header = new Headers(page);
    roomManager = new RoomPage(page);

    await adminPage.openURL("/#/admin/");
    await adminPage.doLogin("admin", "password");
    await expect(header.logoutLink.isVisible());
  });

  for (const [
    roomName,
    roomType,
    roomAccessbile,
    roomPrice,
    roomAnities,
  ] of rooms) {
    test(`Administration is able to create with ${roomName} has ${roomType} by fill up all mandatory fields`, async ({
      page,
    }) => {
      await roomManager.createRoom(
        roomName,
        roomType,
        roomAccessbile,
        roomPrice,
        roomAnities
      );
      const Price = roomPrice.toString();
      const accesssibleString = roomAccessbile.toString();
    });
  }
});
