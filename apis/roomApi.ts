import { APIRequestContext, expect } from "@playwright/test";
import { BaseAPI } from "./baseApi";
import { RoomAmenities, RoomType } from "../utils/data_helper";
import { getExtendImages } from "../utils/helper";
import { getAmenitiesAsList } from "../pages/roomPage";

const roomPath = process.env.BASE_API_URL + '/room';
export class RoomApi extends BaseAPI {

    constructor(request: APIRequestContext) {
        super(request);
    }

    async createRoom(roomName: string, roomType: RoomType, accessible: boolean, price: number, roomAmenities: RoomAmenities) {
        // await this.deleteAllRooms(roomName);
        const response = await this.request.post(roomPath, {
            // headers: {
            //     cookie: "token=7ppPnzRV5PVX5w59"
            // },
            data: {
                roomName: roomName,
                type: roomType,
                accessible: accessible,
                roomPrice: price,
                image: getExtendImages(roomType),
                features: getAmenitiesAsList(roomAmenities),
                description: "Room Created with Automated Test"
            }
        });
        await expect(response.status()).toBe(200);

    }

    async deleteRoom(roomId: number) {
        const response = await this.request.delete(roomPath + `/${roomId}`);
        await expect(response.status()).toBe(200);
        console.log(JSON.parse(await response.text()));
    }

    async deleteAllRooms(roomName: string) {
        console.log(roomPath);
        const getRoomResponse = await this.request.get(roomPath, { timeout: 0 });
        await expect(getRoomResponse.status()).toBe(200);
        const getRoomData = JSON.parse(await getRoomResponse.text());
        const allRooms = getRoomData.rooms;
        const filteredByRoom = allRooms.filter((room: any) => room.roomName == roomName);
        for (const room of filteredByRoom) await this.deleteRoom(room.roomId);
    }
}