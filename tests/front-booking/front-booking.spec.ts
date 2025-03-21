import { test } from "../../base/custom_fixtures";
import { BookingApi } from "../../apis/bookingApi";
import { RoomApi } from "../../apis/roomApi";
import { defaultRoomBooking, user } from "../../utils/data_helper";
import { getTheDateFromCurrectDate } from "../../utils/helper";

test.describe("Front Page booking function", async() => {
    let bookingApi: BookingApi;
    let roomApi: RoomApi;

    test.beforeEach("Setup room", async ({ request }) => {
        roomApi = new RoomApi(request);
        bookingApi = new BookingApi(request);

        roomApi.createRoom(defaultRoomBooking.roomName, defaultRoomBooking.type, defaultRoomBooking.accessible, defaultRoomBooking.price, defaultRoomBooking.roomAmenities);
    });

    test("Booking Room function", async ({ frontPage }) => {
        const checkin = getTheDateFromCurrectDate(2);
        const checkout = getTheDateFromCurrectDate(5);
        await frontPage.makeARoomBooking(user.firstname, user.lastname, user.email, user.phone, checkin, checkout);
    });
})