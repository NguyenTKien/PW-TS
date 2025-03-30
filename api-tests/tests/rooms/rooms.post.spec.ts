import { expect } from "@playwright/test";
import { getAmenitiesAsList } from "../../../pages/roomPage";
import { STORAGE_STATE_PATH } from "../../../playwright.config";
import { defaultRoomBooking } from "../../../utils/data_helper";
import { getExtendImages, readJsonData } from "../../../utils/helper";
import { roomPath } from "../../apis/roomApi";
import { test } from "../../base/api_fixtures";
import path from "path";
import Ajv from "ajv";
import schemaPostAgainstReponse from "../../api-schemes/rooms/POST-response-room-schema.json";

test.describe("POST room error request", () => {
    const jsonFilePath = path.resolve(__dirname, '../../../utils/data.json');
    const json = readJsonData(jsonFilePath);
    const storageState = STORAGE_STATE_PATH + process.env.STORAGE_STATE_ADMIN_FILE;
    test.use({ storageState });
    test("POST room got error when sending missing token", async ({ roomApi }) => {
        const reponse = await roomApi.request.post(roomPath, {
            data: {
                roomName: defaultRoomBooking.roomName,
                type: defaultRoomBooking.type,
                accessible: defaultRoomBooking.accessible,
                roomPrice: defaultRoomBooking.price,
                image: getExtendImages(defaultRoomBooking.type),
                features: getAmenitiesAsList(defaultRoomBooking.roomAmenities),
                description: "Room Created with Automated Test",
            },
        });
        expect(reponse.status()).toBe(401);
        expect(await reponse.text()).toContain("Authentication required");
    })

    test("POST room got error when sending invalid token", async ({ roomApi }) => {
        const reponse = await roomApi.request.post(roomPath, {
            headers: {
                cookie: `token=jvrnvjlknwvn`
            },
            data: {
                roomName: defaultRoomBooking.roomName,
                type: defaultRoomBooking.type,
                accessible: defaultRoomBooking.accessible,
                roomPrice: defaultRoomBooking.price,
                image: getExtendImages(defaultRoomBooking.type),
                features: getAmenitiesAsList(defaultRoomBooking.roomAmenities),
                description: "Room Created with Automated Test",
            },
        });
        expect(reponse.status()).toBe(500);
        expect(await reponse.text()).toContain("An unexpected error occurred");
    })

    test("POST room got error when sending missing body", async ({ roomApi }) => {
        const reponse = await roomApi.request.post(roomPath, {
            headers: {
                cookie: `token=jvrnvjlknwvn`
            },
            data: {}
        });
        expect(reponse.status()).toBe(400);
        const responseBody = await reponse.json();
        const resultErrors = await json.apiErrors.sort();
        console.log(await responseBody);
        expect(await responseBody.errors.sort()).toEqual(resultErrors);
    });
});

test.describe("POST room valid request", () => {
    //TODO: Handling datas response
    // test("POST room with correct schema", async ({ roomApi }) => {
    //     const ajv = new Ajv();
    //     const reponse = await roomApi.request.post(roomPath, {
    //         data: {
    //             roomName: defaultRoomBooking.roomName,
    //             type: defaultRoomBooking.type,
    //             accessible: defaultRoomBooking.accessible,
    //             roomPrice: defaultRoomBooking.price,
    //             image: getExtendImages(defaultRoomBooking.type),
    //             features: getAmenitiesAsList(defaultRoomBooking.roomAmenities),
    //             description: "Room Created with Automated Test",
    //         },
    //     });
    //     expect(reponse.status()).toBe(200);
    //     const responseBody = await reponse.body();
    //     const validateSchema = ajv.compile(schemaPostAgainstReponse);
    //     const isValid = validateSchema(responseBody);
    //     if (!isValid) {
    //         console.error("Schema validation errors:", validateSchema.errors)
    //     }
    //     expect(isValid).toBeTruthy();
    // })

    test("POST room with correct info", async ({ roomApi }) => {
        const reponse = await roomApi.request.post(roomPath, {
            data: {
                roomName: defaultRoomBooking.roomName,
                type: defaultRoomBooking.type,
                accessible: defaultRoomBooking.accessible,
                roomPrice: defaultRoomBooking.price,
                image: getExtendImages(defaultRoomBooking.type),
                features: getAmenitiesAsList(defaultRoomBooking.roomAmenities),
                description: "Room Created with Automated Test",
            },
        });
        expect(reponse.status()).toBe(200);
        const responseJson = await reponse.json();
        expect(responseJson.success).toEqual(true);
    })
});