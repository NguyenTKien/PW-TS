import { APIRequestContext, expect } from "@playwright/test";
import { BaseAPI } from "./baseApi";
import { RoomAmenities, RoomType } from "../../utils/data_helper";
import { getExtendImages } from "../../utils/helper";
import { getAmenitiesAsList } from "../../pages/roomPage";

const roomPath = process.env.BASE_API_URL + "/room";
export class RoomApi extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async createRoom(
    roomName: string,
    roomType: RoomType,
    accessible: boolean,
    price: number,
    roomAmenities: RoomAmenities
  ) {
    await this.deleteAllRooms();
    const response = await this.request.post(roomPath, {
      data: {
        roomName: roomName,
        type: roomType,
        accessible: accessible,
        roomPrice: price,
        image: getExtendImages(roomType),
        features: getAmenitiesAsList(roomAmenities),
        description: "Room Created with Automated Test",
      },
    });
    await expect(response.status()).toBe(200);
  }

  async deleteRoom(roomId: number) {
    const response = await this.request.delete(roomPath + `/${roomId}`);
    await expect(response.status()).toBe(200);
    // console.log(JSON.parse(await response.text()));
  }

  async deleteAllRooms() {
    const getRoomResponse = await this.request.get(roomPath, { timeout: 0 });
    await expect(getRoomResponse.status()).toBe(200);
    const getRoomData = JSON.parse(await getRoomResponse.text());
    const allRooms = getRoomData.rooms;
    const roomList: { roomid: number }[] = allRooms.map((room: { roomid: number }) => room);
    for (const room of roomList) await this.deleteRoom(room.roomid);
  }
}