import { test as base } from "@playwright/test"
import { BookingApi } from "../apis/bookingApi"
import { MessageApi } from "../apis/messageApi"
import { RoomApi } from "../apis/roomApi"
import { AuthenticationApi } from "../apis/authApi"

type ApiFixtures = {
  roomApi: RoomApi
  bookingApi: BookingApi
  messageApi: MessageApi
  authApi: AuthenticationApi;
}

export const test = base.extend<ApiFixtures>({
  authApi: async ({ request }, use) => {
    const authApi = new AuthenticationApi(request);
    await use(authApi);
  },

  roomApi: async ({ request }, use) => {
    const roomApi = new RoomApi(request);
    await use(roomApi);
  },

  bookingApi: async ({ request }, use) => {
    const bookingApi = new BookingApi(request);
    await use(bookingApi);
  },

  messageApi: async ({ request }, use) => {
    const messageApi = new MessageApi(request);
    await use(messageApi);
  },
})
