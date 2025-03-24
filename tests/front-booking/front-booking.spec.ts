import { test } from "../../base/custom_fixtures";
import { BookingApi } from "../../apis/bookingApi";
import { RoomApi } from "../../apis/roomApi";
import {
  BookingSucces,
  defaultRoomBooking,
  user,
} from "../../utils/data_helper";
import {
  getFutureDate,
  getTheDateFromCurrectDate,
  readJsonData,
} from "../../utils/helper";
import path from "path";

const jsonFilePath = path.resolve(__dirname, "../../utils/data.json");
const data = readJsonData(jsonFilePath);

test.describe("Front Page booking function", async () => {
  let bookingApi: BookingApi;
  let roomApi: RoomApi;
  const checkout = getTheDateFromCurrectDate(-1);
  const checkoutDate = getFutureDate(0);

  test.beforeEach("Setup room", async ({ request }) => {
    roomApi = new RoomApi(request);
    bookingApi = new BookingApi(request);

    roomApi.createRoom(
      defaultRoomBooking.roomName,
      defaultRoomBooking.type,
      defaultRoomBooking.accessible,
      defaultRoomBooking.price,
      defaultRoomBooking.roomAmenities
    );
  });

  test("Booking Room function @front-page @sanity", async ({ frontPage }) => {
    console.log(checkoutDate);
    await frontPage.makeARoomBooking(
      user.firstname,
      user.lastname,
      user.email,
      user.phone,
      checkout
    );
    await frontPage.verifyDialogBookingSuccessed(
      BookingSucces.BookingTitle,
      BookingSucces.BookingContent,
      checkoutDate
    );
  });

  /* Test cases:
    - Error message when leave the first name blank
    - Error message when leave the last name blank
    - Error message when leave the email name blank
    - Error message when leave the phone name blank
    - Error message when empty select booking date
    - Error message when inputting invalid first name field
    - Error message when inputting invalid last name field
    - Error message when inputting invalid email format field
    - Error message when inputting invalid phone field
   */
  test("Error message when inputing invalid booking information @front-page", async ({
    frontPage,
  }) => {
    await frontPage.makeARoomBooking(
      "", //Empty field
      user.lastname,
      user.email,
      user.phone,
      checkout
    );
    await frontPage.verifyErrorMessage(data.errorMessage.leaveFirstnameBlank);

    await frontPage.cancelRoomButton.click();
    await frontPage.makeARoomBooking(
      "ab", // Invalid input field
      user.lastname,
      user.email,
      user.phone,
      checkout
    );
    await frontPage.verifyErrorMessage(
      data.errorMessage.between3and18characters
    );

    await frontPage.cancelRoomButton.click();
    await frontPage.makeARoomBooking(
      user.firstname,
      "", //Empty field
      user.email,
      user.phone,
      checkout
    );
    await frontPage.verifyErrorMessage(data.errorMessage.leaveLastnameBlank);

    await frontPage.cancelRoomButton.click();
    await frontPage.makeARoomBooking(
      user.firstname,
      "ab", //Invalid field input
      user.email,
      user.phone,
      checkout
    );
    await frontPage.verifyErrorMessage(
      data.errorMessage.between3and18characters
    );

    await frontPage.cancelRoomButton.click();
    await frontPage.makeARoomBooking(
      user.firstname,
      user.lastname,
      "", //Empty field
      user.phone,
      checkout
    );
    await frontPage.verifyErrorMessage(data.errorMessage.errorNoInput);

    await frontPage.cancelRoomButton.click();
    await frontPage.makeARoomBooking(
      user.firstname,
      user.lastname,
      "emailNoValid", //Invalid field input
      user.phone,
      checkout
    );
    await frontPage.verifyErrorMessage(data.errorMessage.invalidEmailFormat);

    await frontPage.cancelRoomButton.click();
    await frontPage.makeARoomBooking(
      user.firstname,
      user.lastname,
      user.email,
      "", //Empty field
      checkout
    );
    await frontPage.verifyErrorMessage(data.errorMessage.phoneEmpty);

    await frontPage.cancelRoomButton.click();
    await frontPage.makeARoomBooking(
      user.firstname,
      user.lastname,
      user.email,
      "09334567", // Invalid field input
      checkout
    );
    await frontPage.verifyErrorMessage(
      data.errorMessage.between11and21characters
    );

    await frontPage.cancelRoomButton.click();
    await frontPage.makeARoomBooking(
      user.firstname,
      user.lastname,
      user.email,
      user.phone,
      null
    );
    await frontPage.verifyErrorMessage(data.errorMessage.errorNoInput);
  });
});

/* Test cases:
    - Error message when requesting message with leaving the name blank
    - Error message when requesting message with leaving the email name blank
    - Error message when requesting message with leaving the phone name blank
    - Error message when requesting message with leaving the subject field blank
    - Error message when requesting message with leaving the message field blank
    - Error message when requesting message with invalid email format
    - Error message when requesting message with invalid phone field
    - Error message when requesting message with invalid subject field
    - Error message when requesting message with invalid message field
   */
test.describe("Contact with administrative", async () => {
  test("Error message when inputting invalid message information @front-page", async ({
    frontPage,
  }) => {
    await frontPage.makeARequestMessage(
      "",
      user.email,
      user.phone,
      data.message.title.validinput,
      data.message.content.validinput
    );
    await console.log(data.message.title.validinput);
    await frontPage.verifyErrorMessage(data.errorMessage.leaveNameBlank);

    await frontPage.makeARequestMessage(
      user.firstname,
      "",
      user.phone,
      data.message.title.validinput,
      data.message.content.validinput
    );
    await frontPage.verifyErrorMessage(data.errorMessage.leaveEmailBlank);

    await frontPage.makeARequestMessage(
      user.firstname,
      "InvalidEmailFormat",
      user.phone,
      data.message.title.validinput,
      data.message.content.validinput
    );
    await frontPage.verifyErrorMessage(data.errorMessage.invalidEmailFormat);

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      "",
      data.message.title.validinput,
      data.message.content.validinput
    );
    await frontPage.verifyErrorMessage(data.errorMessage.leavePhoneBlank);

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      "09402",
      data.message.title.validinput,
      data.message.content.validinput
    );
    await frontPage.verifyErrorMessage(
      data.errorMessage.between11and21characters
    );

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      user.phone,
      data.message.title.lessthan5characters,
      data.message.content.validinput
    );
    await frontPage.verifyErrorMessage(
      data.errorMessage.between5and100characters
    );

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      user.phone,
      "",
      data.message.content.validinput
    );
    await frontPage.verifyErrorMessage(data.errorMessage.leaveSubjectBlank);

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      user.phone,
      data.message.title.validinput,
      ""
    );
    await frontPage.verifyErrorMessage(data.errorMessage.leaveMessageBlank);

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      user.phone,
      data.message.title.validinput,
      data.message.content.lessthan20characters
    );
    await frontPage.verifyErrorMessage(
      data.errorMessage.between20and2000characters
    );
  });

  test("Sending request message successfully @front-page @sanity", async ({ frontPage }) => {
    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      user.phone,
      data.message.title.validinput,
      data.message.content.validinput
    );
    await frontPage.verifyRequestMessageSuccess(
      data.message.requestSuccessTitle,
      user.firstname,
      data.message.title.validinput
    );
  });
});
