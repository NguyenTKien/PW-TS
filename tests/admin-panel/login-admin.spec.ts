import { test, expect } from "@playwright/test";
import { AdminPage } from "../../pages/adminPage";
import { Headers } from "../../pages/Components/headers";

test.describe("Login", () => {
  let adminPage: AdminPage;
  let header: Headers;

  test.beforeEach("Open Page", async ({ page, baseURL }) => {
    adminPage = new AdminPage(page);
    header = new Headers(page);
    await adminPage.hideBanner(baseURL);
    await adminPage.openURL("/#/admin");
  });

  test("Administration user is able to login with valid username and password @sanity @login", async ({page}) => {
    await adminPage.doLogin("admin", "password");
    await expect(header.logoutLink).toBeVisible();
});

  test.skip("The user is not able to login with empty username @login", async () => {
    await adminPage.doLogin("", "password");
    await expect(adminPage.passwordField).toHaveAttribute("style", "border: 1px solid red;");
  });

  test.skip("The user is not able to login with empty password @login", async () => {
    await adminPage.doLogin("admin", "");
    await expect(adminPage.passwordField).toHaveAttribute("style", "border: 1px solid red;");
  });

  test.skip("The user is not able to login with incorrect password @login", async () => {
    await adminPage.doLogin("admin", "wrongpassword");
    await expect(adminPage.loginButton).toBeVisible();
  });

  test.skip("The user is not able to login with incorrect username @login", async () => {
    await adminPage.doLogin("wronguser", "password");
    await expect(adminPage.loginButton).toBeVisible();
  });
});
