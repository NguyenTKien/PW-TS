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
    expect(response.status()).toBe(200);
    console.log(await response.text())
    expect(await response.text()).toContain("token");
  })

  test("POST with missing password of credentials", async ({ authApi }) => {
    const response = await authApi.getResponseAuthPost(user, null)

    expect(response.status()).toBe(401);
    expect(await response.text()).toContain("Invalid credentials");
  })

  test("POST with invalid password credentials", async ({ authApi }) => {
    const response = await authApi.getResponseAuthPost(user, "invalid password");

    expect(response.status()).toBe(401);
    expect(await response.text()).toContain("Invalid credentials");
  })

  test("POST verify token", async ({ authApi }) => {
    const response = await authApi.getResponseAuthPost(user, password)

    expect(response.status()).toBe(200)
    const responseBody = await response.json()
    const token = responseBody.token
    console.log("Token: ", token)

    const responseValidate = await authApi.getResponseValidatePost(token)
    expect(responseValidate.status()).toBe(200)
  })

  test("POST verify token expired", async ({ authApi }) => {
    const responseValidate = await authApi.getResponseValidatePost("xwmljVEWmY3VoOlD");
    expect(responseValidate.status()).toBe(403);
    expect(await responseValidate.text()).toContain("Invalid token")
  })
})
