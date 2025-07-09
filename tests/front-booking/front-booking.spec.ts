import { test } from "../../base/custom_fixtures"
import { user } from "../../utils/data_helper"
import {
  readJsonData,
} from "../../utils/helper"
import path from "path"
import { MessageApi } from "../../api-tests/apis/messageApi"
import { expect } from "@playwright/test"

const jsonFilePath = path.resolve(__dirname, "../../utils/data.json")
const data = readJsonData(jsonFilePath)
let messageApi: MessageApi

test.describe("Front Page booking function", async () => {
  // const checkoutDate = getLastDateOfMonth()

  test("Snapshot of Front Page", async ({ frontPage }) => {
    await frontPage.body.waitFor({ state: "visible" })
    await expect(frontPage.body).toMatchAriaSnapshot({
      name: "front-page.aria.yml",
    })
  })
})

test.describe("Contact with administrative", async () => {
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
  test("Error message when inputting invalid message information @front-page", async ({ frontPage }) => {
    await frontPage.makeARequestMessage(
      "",
      user.email,
      user.phone,
      data.message.title.validinput,
      data.message.content.validinput,
    )
    console.log(data.message.title.validinput)
    await frontPage.verifyErrorMessage(data.errorMessage.leaveNameBlank)

    await frontPage.makeARequestMessage(
      user.firstname,
      "",
      user.phone,
      data.message.title.validinput,
      data.message.content.validinput,
    )
    await frontPage.verifyErrorMessage(data.errorMessage.leaveEmailBlank)

    await frontPage.makeARequestMessage(
      user.firstname,
      "InvalidEmailFormat",
      user.phone,
      data.message.title.validinput,
      data.message.content.validinput,
    )
    await frontPage.verifyErrorMessage(data.errorMessage.invalidEmailFormat)

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      "",
      data.message.title.validinput,
      data.message.content.validinput,
    )
    await frontPage.verifyErrorMessage(data.errorMessage.leavePhoneBlank)

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      "09402",
      data.message.title.validinput,
      data.message.content.validinput,
    )
    await frontPage.verifyErrorMessage(data.errorMessage.between11and21characters)

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      user.phone,
      data.message.title.lessthan5characters,
      data.message.content.validinput,
    )
    await frontPage.verifyErrorMessage(data.errorMessage.between5and100characters)

    await frontPage.makeARequestMessage(user.firstname, user.email, user.phone, "", data.message.content.validinput)
    await frontPage.verifyErrorMessage(data.errorMessage.leaveSubjectBlank)

    await frontPage.makeARequestMessage(user.firstname, user.email, user.phone, data.message.title.validinput, "")
    await frontPage.verifyErrorMessage(data.errorMessage.leaveMessageBlank)

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      user.phone,
      data.message.title.validinput,
      data.message.content.lessthan20characters,
    )
    await frontPage.verifyErrorMessage(data.errorMessage.between20and2000characters)
  })

  test("Sending request message successfully @front-page @sanity", async ({
    request,
    frontPage,
    headerPage,
    messagePage,
  }) => {
    messageApi = new MessageApi(request)
    await messageApi.deleteAllMessage()

    await frontPage.makeARequestMessage(
      user.firstname,
      user.email,
      user.phone,
      data.message.title.validinput,
      data.message.content.validinput,
    )
    await frontPage.verifyRequestMessageSuccess(
      data.message.requestSuccessTitle,
      user.firstname,
      data.message.title.validinput,
    )
    await messagePage.verifyMessageDisplayCorrectly(user.firstname, data.message.title.validinput)
    await headerPage.verifyNotificationMessageDislayed()
  })
})
