import { test as base } from '@playwright/test';
import { AdminPage } from "../pages/adminPage";
import { BookingPage } from "../pages/bookingPage";
import { RoomPage } from "../pages/roomPage";
import { Headers } from '../pages/Components/headers';
import { MessagePage } from '../pages/messagePage';
import { FrontPage } from '../pages/frontPage';

type MyFixtures = {
    adminPage: AdminPage;
    roomPage: RoomPage;
    bookingPage: BookingPage;
    headerPage: Headers;
    frontPage: FrontPage;
    messagePage: MessagePage;
};

export const test = base.extend<MyFixtures>({
    adminPage: async({ page }, use) => {
        const adminPage = new AdminPage(page);
        await adminPage.openURL("/admin");
        await use(adminPage);
    },

    roomPage: async({ page }, use) => {
        const roomPage = new RoomPage(page);
        await roomPage.goToRoomPage();
        await use(roomPage);
    },

    bookingPage: async({ page }, use) => {
        const bookingPage = new BookingPage(page);
        await bookingPage.goToBookingPage();
        await use(bookingPage);
    },

    headerPage: async({ page }, use) => {
        const headerPage = new Headers(page);
        await use(headerPage);
    },

    frontPage: async({page}, use) => {
        const frontPage = new FrontPage(page);
        await frontPage.waitForFrontPage();
        await use(frontPage);
    },

    messagePage: async({page}, use) => {
        const messagePage = new MessagePage(page);
        // await messagePage.waitForMessagePage();
        await use(messagePage);
    }
})