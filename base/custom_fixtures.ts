import { test as base } from '@playwright/test';
import { AdminPage } from "../pages/admin-page/adminPage";
import { BookingPage } from "../pages/bookingPage";
import { RoomPage } from "../pages/admin-page/roomPage";
import { Headers } from '../pages/Components/headers';
import { FrontPage } from '../pages/front-page/frontPage';
import { MessagePage } from '../pages/messagePage';
import { RoomsPage } from '../pages/front-page/roomPages';

type MyFixtures = {
    adminPage: AdminPage;
    roomPage: RoomPage;
    bookingPage: BookingPage;
    headerPage: Headers;
    frontPage: FrontPage;
    messagePage: MessagePage;
    roomsPage: RoomsPage
};

export const test = base.extend<MyFixtures>({
    adminPage: async ({ page }, use) => {
        const adminPage = new AdminPage(page);
        await adminPage.openURL("/admin");
        await use(adminPage);
    },

    roomPage: async ({ page }, use) => {
        const roomPage = new RoomPage(page);
        await roomPage.goToRoomPage();
        await use(roomPage);
    },

    bookingPage: async ({ page }, use) => {
        const bookingPage = new BookingPage(page);
        await bookingPage.goToBookingPage();
        await use(bookingPage);
    },

    headerPage: async ({ page }, use) => {
        const headerPage = new Headers(page);
        await use(headerPage);
    },

    frontPage: async ({ page }, use) => {
        const frontPage = new FrontPage(page);
        await frontPage.waitForFrontPage();
        await use(frontPage);
    },

    messagePage: async ({ page }, use) => {
        const messagePage = new MessagePage(page);
        // await messagePage.waitForMessagePage();
        await use(messagePage);
    },

    roomsPage: async ({ page }, use) => {
        const roomsPage = new RoomsPage(page);
        await use(roomsPage);
    }
})