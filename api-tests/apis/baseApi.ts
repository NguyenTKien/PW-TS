import { APIRequestContext, APIResponse } from "@playwright/test"
import { ReadStream } from "fs"

export class BaseAPI {
  readonly request: APIRequestContext

  constructor(request: APIRequestContext) {
    this.request = request
  }

  async postRequest(
    endpoint: string,
    options: {
      data?: string | Buffer | { query: string | null; variables?: object } | {[key: string]: string | null};
      headers?: { [key: string]: string };
      multipart?: {
        [key: string]:
          | string
          | number
          | boolean
          | ReadStream
          | {
              name: string
              mimeType: string
              buffer: Buffer
            }
      };
    },
  ): Promise<APIResponse> {
    const apiResponse = await this.request.post(process.env.BASE_API_URL + `${endpoint}`, options)

    // if (apiResponse.status() != 200) {
    //   const message = await apiResponse.json()
    //   return Promise.reject(message)
    // }

    return apiResponse
  }
}
