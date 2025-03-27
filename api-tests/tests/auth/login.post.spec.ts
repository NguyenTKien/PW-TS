import { expect } from "@playwright/test";
import { test } from "../../base/api_fixtures";

test.describe("test api authentication function", async () => {
    const user = process.env.EMAIL ?? "";
    const password = process.env.PASSWORD ?? "";
    const endpoint = "/auth/login/";

    test("POST with valid credentias", async ({ authApi }) => {
        const start = Date.now();
        const response = await authApi.postRequest("/auth/login/", {
            data: {
                username: user,
                password: password
            }
        })
        const end = Date.now();

        //Asert
        expect(end - start).toBeLessThan(2000);
        console.log(end - start);
        expect (response.status()).toBe(200);
        console.log(await response.text());
        expect (await response.text()).toContain("token");
    });

    test("POST with invalid credentials", async ({ authApi }) => {
        const response = await authApi.postRequest(endpoint, {
            data: { username: user}
        })

        expect (await response.status()).toBe(401);
        expect (await response.text()).toContain("Invalid credentials");
    })
})