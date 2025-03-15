import { Page, Locator } from "@playwright/test";
import { BaseTest } from "./basetest";
import { RoomAmenities, RoomType } from "../utils/data_helper";

export class RoomPage extends BaseTest {
  readonly roomIdField: Locator;
  readonly roomType: Locator;
  readonly roomAccessbile: Locator;
  readonly roomPrice: Locator;
  readonly wifiCheckbox: Locator;
  readonly tvCheckbox: Locator;
  readonly refreshmentsCheckbox: Locator;
  readonly safeCheckbox: Locator;
  readonly radioCheckbox: Locator;
  readonly viewsCheckbox: Locator;
  readonly createButton: Locator;
  readonly listRoomRecord: Locator;
  readonly editButton: Locator;
  readonly errorMessage: Locator;
  readonly updateButton: Locator;

  constructor(page: Page) {
    super(page);
    this.roomIdField = page.getByTestId("roomName");
    this.roomType = page.locator("#type");
    this.roomAccessbile = page.locator("#accessible");
    this.roomPrice = page.locator("#roomPrice");
    this.wifiCheckbox = page
      .getByRole("checkbox")
      .and(page.locator("#wifiCheckbox"));
    this.tvCheckbox = page.getByLabel("TV");
    this.refreshmentsCheckbox = page.getByLabel("Refreshments");
    this.safeCheckbox = page.getByLabel("Safe");
    this.radioCheckbox = page.getByLabel("Radio");
    this.viewsCheckbox = page.getByLabel("Views");
    this.createButton = page.locator("#createRoom");
    this.listRoomRecord = page.getByTestId("roomlisting");
    //Edit button locator
    this.editButton = page.locator("//button[contains(text(),'Edit')]");
    this.errorMessage = page.locator("//div[@class='alert alert-danger']/p");
    this.updateButton = page.locator("//button[@id='update']");
  }

  async selectRoomType(type: RoomType | null) {
    if (type != null) await this.roomType.selectOption(type);
  }

  async inputPrice(price: number | null) {
    if (price != null) await this.roomPrice.fill(price.toString());
  }

  async selectRoomAmenities(roomanities: RoomAmenities) {
    if (roomanities.wifi) await this.wifiCheckbox.check();
    else {
      this.wifiCheckbox.uncheck({ force: true });
    }
    if (roomanities.TV) await this.tvCheckbox.check();
    else await this.tvCheckbox.uncheck();
    if (roomanities.Radio) await this.radioCheckbox.check();
    else await this.radioCheckbox.uncheck();
    if (roomanities.Refreshment) await this.refreshmentsCheckbox.check();
    else await this.refreshmentsCheckbox.uncheck();
    if (roomanities.safe) await this.safeCheckbox.check();
    else await this.safeCheckbox.uncheck();
    if (roomanities.views) await this.viewsCheckbox.check();
    else await this.viewsCheckbox.uncheck();
  }

  async createRoom(
    roomID: string,
    type: RoomType | null,
    accesssible: boolean,
    price: number | null,
    roomDetails: RoomAmenities
  ) {
    await this.roomIdField.fill(roomID);
    await this.selectRoomType(type);
    await this.roomAccessbile.selectOption(accesssible ? "true" : "false");
    await this.inputPrice(price);
    await this.selectRoomAmenities(roomDetails);
    await this.createButton.click();
  }

  getRoomRecord(roomName: string): Locator {
    return this.page
      .locator(
        `//div[@data-testid='roomlisting'][.//p[contains(@id,'${roomName}')]]`
      )
      .last();
  }

  getRoomNameLocator(roomRecord: Locator): Locator {
    return roomRecord.locator("p[id*=roomName]");
  }

  getRoomTypeLocator(roomRecord: Locator): Locator {
    return roomRecord.locator("p[id*=type]");
  }

  getRoomAccessibleLocator(roomRecord: Locator): Locator {
    return roomRecord.locator("p[id*=accessible]");
  }

  getRoomPriceLocator(roomRecord: Locator): Locator {
    return roomRecord.locator("p[id*=roomPrice]");
  }

  getRoomDetailsLocator(roomRecord: Locator): Locator {
    return roomRecord.locator("p[id*=details]");
  }

  getErrorMessageLocator(): Locator {
    return this.errorMessage;
  }

  getEditButtonLocator(): Locator {
    return this.editButton;
  }

  getUpdateRoomValueLocator(roomValue: string): Locator {
    return this.page.locator(`//input[@value='${roomValue}']`);
  }

  getUpdateSelectLocator(selectType: string): Locator {
    return this.page.locator(`//select[@id='${selectType}']`);
  }

  async clickToUpdateButton(): Promise<void> {
    this.updateButton.isEnabled().then(() => {
      this.updateButton.click().then(() => {
        this.page.waitForLoadState("load", { timeout: 5000 }).then(() => {
          this.page.waitForLoadState("domcontentloaded");
          this.page.goto("/#/admin");
        });
      });
    });
  }

  async clickToDeleteButton(roomName: string): Promise<void> {
    const deleteRoomBooking = this.page.locator(
      `//div[@data-testid='roomlisting'][.//p[contains(@id,'${roomName}')]]//span`
    );
    deleteRoomBooking.isEnabled().then(() => {
      deleteRoomBooking.click();
    });
  }

  async getListRoomRecordCount(): Promise<number> {
    const count = await this.listRoomRecord.count();
    return count;
  }
}

export function getAmenitiesAsList(roomAmenities: RoomAmenities): string[] {
  const amenities: string[] = [];
  if (roomAmenities.wifi) amenities.push("WiFi");
  if (roomAmenities.TV) amenities.push("TV");
  if (roomAmenities.Radio) amenities.push("Radio");
  if (roomAmenities.Refreshment) amenities.push("Refreshments");
  if (roomAmenities.safe) amenities.push("Safe");
  if (roomAmenities.views) amenities.push("Views");
  return amenities;
}

export function getRoomDetailsFromAmenities(roomAmenities: RoomAmenities) {
  const amenities: string[] = getAmenitiesAsList(roomAmenities);
  return amenities.length == 0
    ? "No features added to the room"
    : amenities.join(", ");
}
