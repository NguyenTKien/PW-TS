import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { RoomAmenities, RoomType } from "../utils/data_helper";

export class RoomPage extends BasePage {
  readonly roomNameField: Locator;
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
  readonly editBookingButton: Locator;
  readonly firstnameEdit: Locator;
  readonly lastnameEdit: Locator;
  readonly depositPaidEdit: Locator;
  readonly checkinEdit: Locator;
  readonly checkoutEdit: Locator;
  readonly confirmBookingEditButton: Locator;
  readonly updateBookingInfo: Locator;
  readonly deleteBookingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.roomNameField = page.getByTestId("roomName");
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
    //Room details
    this.editBookingButton = page.locator(
      "//span[contains(@class, 'bookingEdit')]"
    );
    this.confirmBookingEditButton = page.locator(
      "//span[contains(@class, 'confirmBookingEdit')]"
    );
    this.firstnameEdit = page.locator("//input[@name='firstname']");
    this.lastnameEdit = page.locator("//input[@name='lastname']");
    this.depositPaidEdit = page.locator("//select[@name='depositpaid']");
    this.checkinEdit = page.locator(
      "//div[contains(@class, 'datepicker')]//input"
    );
    this.checkoutEdit = page.locator(
      "//div[contains(@class, 'datepicker')]//input"
    );
    this.updateBookingInfo = page.locator(
      "//div[contains(@class, 'detail booking')]//div[@class='row']//p"
    );
    this.deleteBookingButton = page.locator(
      "//span[contains(@class, 'bookingDelete')]"
    );
  }

  async goToRoomPage() {
    this.page.goto("/admin/rooms");
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
    roomName: string,
    type: RoomType | null,
    accesssible: boolean,
    price: number | null,
    roomDetails: RoomAmenities
  ) {
    await this.roomNameField.fill(roomName);
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
          this.page.goto("/admin");
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

  async clickToUpdateBooking() {
    await this.editBookingButton.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(500);
  }

  async clickToConfirmUpdateBooking() {
    await this.confirmBookingEditButton.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(500);
  }

  async clickToDeleteBooking() {
    await this.deleteBookingButton.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(500);
  }

  async verifyBookingHasDeleted() {
    console.log(await this.updateBookingInfo.count());
    expect((await this.updateBookingInfo.count()) == 0).toBeTruthy();
  }

  async updateBookingRoom(
    firstname: string,
    lastname: string,
    checkinDate: string,
    checkoutDate: string,
    depositPaid: boolean
  ) {
    await this.firstnameEdit.fill(firstname);
    await this.lastnameEdit.fill(lastname);
    await this.depositPaidEdit.selectOption(depositPaid ? "true" : "false");
    await this.checkinEdit.first().fill(checkinDate);
    await this.checkoutEdit
      .last()
      .clear()
      .then(() => {
        this.checkoutEdit.last().fill(checkoutDate);
      });
  }

  async verifyBookingHasUpdated(
    firstname: string,
    lastname: string,
    checkinDate: string,
    checkoutDate: string
  ) {
    const bookingInfo: string[] = [];
    const elements = await this.updateBookingInfo.elementHandles();
    for (const element of elements) {
      const text = await element.textContent();
      if (text) {
        bookingInfo.push(text.trim());
      }
    }
    console.log(bookingInfo);
    await expect(bookingInfo).toContain(firstname);
    await expect(bookingInfo).toContain(lastname);
    await expect(bookingInfo).toContain(checkinDate);
    await expect(bookingInfo).toContain(checkoutDate);
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