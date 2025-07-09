import { APIRequestContext, APIResponse, expect } from "@playwright/test"
import { BaseAPI } from "./baseApi"
import { BookingInfo, User } from "../../common/interfaces"

export const bookingPath = process.env.BASE_API_URL + "/booking"

export class BookingApi extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request)
  }

  async createBooking(booking: Partial<BookingInfo>, user: User) {
    const response = await this.request.post(bookingPath, {
      data: {
        bookingdates: {
          checkin: booking.checkin,
          checkout: booking.checkout,
        },
        depositpaid: booking.depositpaid,
        firstname: user.firstname,
        lastname: user.lastname,
        roomid: booking.roomid,
        email: user.email,
        phone: user.phone,
      },
    })
    if (response.status() !== 200) {
      console.error(`Expected status 200 but got ${response.status()}`)
      throw new Error("Test failed due to incorrect response status.")
    }
    expect(response.status()).toBe(200)
  }

  async deleteBooking(bookingId: number) {
    const response = await this.request.delete(bookingPath + `/${bookingId}`)
    expect(response.status()).toBe(200)
  }

  async getfirstBookingID(roomid: number): Promise<number> {
    const response = await this.request.get(bookingPath + `?roomid=${roomid}`)
    expect(response.status()).toBe(200)
    // const getRoomData: [TypeValueObject] = await response.json();
    // const firstBooking = getRoomData.find((typeValueObject) => typeValueObject.type === "bookingid")?.value;

    const getBookingData = await response.json()
    const allBookings: BookingInfo[] = getBookingData.bookings
    if (allBookings.length > 0) {
      return allBookings[0].bookingid
    } else {
      throw new Error("No booking rooms available")
    }
  }

  async deleteAllBookingsInFirstRoom(roomId: string) {
    const response = await this.request.get(bookingPath + `?roomid=${roomId}`)
    expect(response.status()).toBe(200)
    const getBookingDatas = JSON.parse(await response.text())
    const allBookings = getBookingDatas.bookings
    const bookingList: { bookingid: number }[] = allBookings.map((booking: { bookingid: number }) => booking)
    for (const book of bookingList) await this.deleteBooking(book.bookingid)
  }

  async putBookingRoom(
    roomid: number,
    bookingid: number,
    firstname: string,
    lastname: string,
    deposit: boolean,
    checkin: string,
    checkout: string,
  ): Promise<APIResponse> {
    const response = await this.request.put(bookingPath + `/${bookingid}`, {
      data: {
        roomid: roomid,
        bookingid: bookingid,
        firstname: firstname,
        lastname: lastname,
        depositpaid: deposit,
        bookingdates: {
          checkin: checkin,
          checkout: checkout,
        },
      },
    })
    return response
  }

  async postBookingRoom(
    // booking: BookingInfo, user: User
    roomid: number,
    firstname: string,
    lastname: string,
    emailAdress: string,
    phone: string,
    depositPaid: boolean,
    checkinDate: string,
    checkoutDate: string,
  ): Promise<APIResponse> {
    const response = await this.postRequest("/booking", {
      data: {
        bookingdates: {
          checkin: checkinDate,
          checkout: checkoutDate,
        },
        depositpaid: depositPaid,
        firstname: firstname,
        lastname: lastname,
        roomid: roomid,
        email: emailAdress,
        phone: phone,
      },
    })
    return response
  }
}
