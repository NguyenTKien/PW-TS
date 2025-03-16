import { APIRequestContext, expect } from "@playwright/test";
import { BaseAPI } from "./baseApi";

const auth = '/auth/login';

export class AuthenticationApi extends BaseAPI {
    constructor(request: APIRequestContext) {
        super(request);
    }

    async signIn(username: string, password: string) {
        const response = await this.request.post(process.env.BASE_API_URL + auth, {
            data: {
                username: username,
                password: password
            }
        });

        expect(response.status()).toBe(200);
    }
}