import { Page, Locator } from "@playwright/test";
import { BaseTest } from "./basetest";

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
  readonly roomRecord: Locator;

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
    this.roomRecord = page.getByTestId("roomlisting").last();
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
      this.wifiCheckbox.uncheck();
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
    price: number,
    roomDetails: RoomAmenities
  ) {
    await this.roomIdField.fill(roomID);
    await this.selectRoomType(type);
    await this.roomAccessbile.selectOption(accesssible ? "true" : "false");
    await this.inputPrice(price);
    await this.selectRoomAmenities(roomDetails);
    await this.createButton.click();
  }
}

export enum RoomType {
  SINGLE = "Single",
  TWIN = "Twin",
  DOUBLE = "Double",
  FAMILY = "Family",
  SUITE = "Suite",
}

export type RoomAmenities = {
  wifi: boolean;
  TV: boolean;
  Radio: boolean;
  Refreshment: boolean;
  safe: boolean;
  views: boolean;
};
