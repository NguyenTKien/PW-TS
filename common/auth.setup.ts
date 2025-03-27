import { test as setup } from "@playwright/test";
import { STORAGE_STATE_PATH } from "../playwright.config";
import { LoginPage } from "../common/login_page";
require("dotenv").config();

// const authFile = path.join(__dirname, STORAGE_STATE_PATH + process.env.STORAGE_STATE_FILE);

setup("Create Login Authentication", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto("/admin")
  console.log(process.env.EMAIL, process.env.PASSWORD);
  if (process.env.EMAIL && process.env.PASSWORD) {
    await loginPage.signIn(process.env.EMAIL.toLowerCase(), process.env.PASSWORD);
  } else {
    throw new Error("EMAIL or PASSWORD environment variables are not set");
  }
  await page.waitForURL("/admin/rooms");
  await page.context().storageState({ path: STORAGE_STATE_PATH + process.env.STORAGE_STATE_FILE })
});

setup("Create No Authentication", async ({ page }) => {
  const adminPage = new LoginPage(page);
  await page.goto("/admin");
  if (process.env.EMAIL && process.env.PASSWORD) {
    await adminPage.signIn(process.env.EMAIL, process.env.PASSWORD);
  } else {
    throw new Error("USERNAME or PASSWORD environment variables are not set");
  }

  await page.context().storageState({ path: STORAGE_STATE_PATH + process.env.STORAGE_STATE_ADMIN_FILE })
  await page.waitForLoadState('load');
});
