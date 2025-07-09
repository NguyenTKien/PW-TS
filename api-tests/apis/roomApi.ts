import { APIRequestContext, APIResponse, expect } from "@playwright/test"
import { BaseAPI } from "./baseApi"
import { getExtendImages } from "../../utils/helper"
import { getAmenitiesAsList } from "../../pages/admin-page/roomPage"
import { Room } from "../../common/interfaces"

export const roomPath = process.env.BASE_API_URL + "/room"
export class RoomApi extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request)
  }

  async createRoom(room: Partial<Room>) {
    await this.deleteAllRooms()
    const response = await this.request.post(roomPath, {
      data: {
        roomName: room.roomname,
        type: room.type,
        accessible: room.accessible,
        roomPrice: room.roomPrice,
        image: getExtendImages(room.type),
        features: getAmenitiesAsList(room.features),
        description: "Room Created with Automated Test",
      },
    })
    expect(response.status()).toBe(200)
  }

  async deleteRoom(roomId: number) {
    const response = await this.request.delete(roomPath + `/${roomId}`)
    expect(response.status()).toBe(200)
  }

  async deleteAllRooms() {
    const getRoomResponse = await this.request.get(roomPath, { timeout: 0 })
    expect(getRoomResponse.status()).toBe(200)
    const getRoomData = await getRoomResponse.json()
    const allRooms = getRoomData.rooms
    const roomList: { roomid: number }[] = allRooms.map((room: { roomid: number }) => room)
    for (const room of roomList) await this.deleteRoom(room.roomid)
  }

  async getResponseRoom(): Promise<APIResponse> {
    const response = await this.request.get(roomPath)
    expect(response.status()).toBe(200)
    return response
  }

  async getfirstRoomID(): Promise<number> {
    const response = await this.request.get(process.env.BASE_API_URL + "/room")
    expect(response.status()).toBe(200)
    // const getRoomData: [TypeValueObject] = await response.json();
    // const firstBooking = getRoomData.find((typeValueObject) => typeValueObject.type === "bookingid")?.value;

    const getRoomData = await response.json()
    const allRooms: Room[] = getRoomData.rooms
    if (allRooms.length > 0) {
      return allRooms[0].roomid
    } else {
      throw new Error("No rooms available")
    }
  }
}
