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

  test("Administration user is able to login with valid usernam and password @sanity @login", async () => {
    await adminPage.doLogin("admin", "password");
    await header.logoutLink.isVisible();
  });

  test("The user is not able to login with empty username @login", async () => {});

  test("The user is not able to login with empty password @login", async () => {});

  test("The user is not ablr to login with incorrect password @login", async () => {});
});
