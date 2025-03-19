import { test } from "../../base/custom_fixtures";
import { expect } from "@playwright/test";
import { AdminPage } from "../../pages/adminPage";
import { Headers } from "../../pages/Components/headers";
import { STORAGE_STATE_PATH } from "../../playwright.config";

test.describe("Login", () => {

  test.use({ storageState: STORAGE_STATE_PATH + process.env.STORAGE_STATE_ADMIN_FILE });

  test("Administration user is able to login with valid username and password @sanity @login", async ({adminPage, headerPage}) => {
    await adminPage.doLogin(process.env.EMAIL?.toLowerCase(), process.env.PASSWORD);
    await expect(headerPage.roomsLink).toBeVisible();
});

  test("The user is not able to login with empty username @login", async ({ adminPage }) => {
    await adminPage.doLogin("", process.env.PASSWORD);
    await expect(adminPage.errorMessage).toBeVisible();
  });

  test("The user is not able to login with empty password @login", async ({ adminPage }) => {
    await adminPage.doLogin(process.env.EMAIL?.toLowerCase(), "");
    await expect(adminPage.errorMessage).toBeVisible();
  });

  test("The user is not able to login with incorrect password @login", async ({ adminPage }) => {
    await adminPage.doLogin(process.env.EMAIL?.toLowerCase(), process.env.PASSWORD);
    await expect(adminPage.loginButton).toBeVisible();
  });

  test("The user is not able to login with incorrect username @login", async ({ adminPage }) => {
    await adminPage.doLogin(process.env.EMAIL?.toLowerCase(), process.env.PASSWORD);
    await expect(adminPage.loginButton).toBeVisible();
  });
});
