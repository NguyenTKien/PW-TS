import { APIRequestContext, expect } from "@playwright/test";
import { BaseAPI } from "./baseApi";
import { Room } from "../common/interfaces";

const bookingPath = process.env.BASE_API_URL + "/booking";

export class BookingApi extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async createBooking(
    roomId: number,
    emailAdress: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    depositPaid: boolean,
    checkinDate: string,
    checkoutDate: string
  ) {
    const response = await this.request.post(bookingPath, {
      data: {
        bookingdates: {
          checkin: checkinDate,
          checkout: checkoutDate,
        },
        depositpaid: depositPaid,
        firstname: firstName,
        lastname: lastName,
        roomid: roomId,
        email: emailAdress,
        phone: phoneNumber,
      },
    });
    // console.log(response);
    await expect(response.status()).toBe(200);
  }

  async deleteBooking(bookingId: number) {
    const response = await this.request.delete(bookingPath + `/${bookingId}`);
    await expect(response.status()).toBe(200);
  }

  async getfirstRoomID(): Promise<number> {
    const response = await this.request.get(process.env.BASE_API_URL + "/room");
    await expect(response.status()).toBe(200);
    const getRoomData = JSON.parse(await response.text());
    const allRooms: Room[] = getRoomData.rooms;
    // console.log(allRooms);
    if (allRooms.length > 0) {
      return allRooms[0].roomid;
    } else {
      throw new Error("No rooms available");
    }
  }

  async deleteAllBookingsInFirstRoom(roomId: string) {
    const response = await this.request.get(bookingPath + `?roomid=${roomId}`);
    await expect(response.status()).toBe(200);
    const getBookingDatas = JSON.parse(await response.text());
    const allBookings = getBookingDatas.bookings;
    // console.log(allBookings);
    const bookingList: { bookingid: number }[] = allBookings.map(
      (booking: { bookingid: number }) => booking
    );
    for (const book of bookingList) await this.deleteBooking(book.bookingid);
  }
}