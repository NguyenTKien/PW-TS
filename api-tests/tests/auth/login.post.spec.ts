import { expect } from "@playwright/test"
import { test } from "../../base/api_fixtures"

test.describe("test api authentication function", async () => {
  const user = process.env.EMAIL ?? ""
  const password = process.env.PASSWORD ?? ""

  test("POST with valid credentias", async ({ authApi }) => {
    const start = Date.now()
    const response = await authApi.getResponseAuthPost(user, password)
    const end = Date.now()

    //Asert
    expect(end - start).toBeLessThan(2000);
    await authApi.VerifyReturnStatus(response, 200);
    console.log(await response.text())
    await authApi.VerifyResponseToContainText(response, "token");
  })

  test("POST with missing password of credentials", async ({ authApi }) => {
    const response = await authApi.getResponseAuthPost(user, null)

    await authApi.VerifyReturnStatus(response, 401);
    await authApi.VerifyResponseToContainText(response, "Invalid credentials");
  })

  test("POST with invalid password credentials", async ({ authApi }) => {
    const response = await authApi.getResponseAuthPost(user, "invalid password");

    await authApi.VerifyReturnStatus(response, 401);
    await authApi.VerifyResponseToContainText(response, "Invalid credentials");
  })

  test("POST verify token", async ({ authApi }) => {
    const response = await authApi.getResponseAuthPost(user, password)

    await authApi.VerifyReturnStatus(response, 200);
    const responseBody = await response.json()
    const token = responseBody.token
    console.log("Token: ", token)

    const responseValidate = await authApi.getResponseValidatePost(token)
    await authApi.VerifyReturnStatus(responseValidate, 200);
  })

  test("POST verify token expired", async ({ authApi }) => {
    const responseValidate = await authApi.getResponseValidatePost("xwmljVEWmY3VoOlD");
    await authApi.VerifyReturnStatus(responseValidate, 403);
    await authApi.VerifyResponseToContainText(responseValidate, "Invalid token");
  })
})
