import { test, expect } from "@playwright/test";
import { AdminPage } from "../../pages/adminPage";
import { Headers } from "../../pages/Components/headers";
import { STORAGE_STATE_PATH } from "../../playwright.config";

test.describe("Login", () => {
  let adminPage: AdminPage;
  let header: Headers;

  test.use({ storageState: STORAGE_STATE_PATH + process.env.STORAGE_STATE_ADMIN_FILE });

  test.beforeEach("Open Page", async ({ page }) => {
    adminPage = new AdminPage(page);
    header = new Headers(page);
    // await adminPage.hideBanner(baseURL);
    // await page.goto("/admin");
    await adminPage.openURL("/admin");
    // await context.close();
  });

  test("Administration user is able to login with valid username and password @sanity @login", async ({page}) => {
    await adminPage.doLogin(process.env.USERNAME?.toLowerCase(), process.env.PASSWORD);
    await expect(header.roomsLink).toBeVisible();
});

  test("The user is not able to login with empty username @login", async () => {
    await adminPage.doLogin("", process.env.PASSWORD);
    await expect(adminPage.errorMessage).toBeVisible();
  });

  test.skip("The user is not able to login with empty password @login", async () => {
    await adminPage.doLogin(process.env.USERNAME?.toLowerCase(), "");
    await expect(adminPage.errorMessage).toBeVisible();
  });

  test.skip("The user is not able to login with incorrect password @login", async () => {
    await adminPage.doLogin(process.env.USERNAME?.toLowerCase(), process.env.PASSWORD);
    await expect(adminPage.loginButton).toBeVisible();
  });

  test("The user is not able to login with incorrect username @login", async () => {
    await adminPage.doLogin(process.env.USERNAME?.toLowerCase(), process.env.PASSWORD);
    await expect(adminPage.loginButton).toBeVisible();
  });
});
