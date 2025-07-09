import { APIRequestContext, APIResponse, expect } from "@playwright/test"
import Ajv from "ajv"
import { ReadStream } from "fs"

export class BaseAPI {
  readonly request: APIRequestContext

  constructor(request: APIRequestContext) {
    this.request = request
  }

  async postRequest(
    endpoint: string,
    options: {
      data?:
      | string
      | Buffer
      | {
        [key: string]:
        | string
        | boolean
        | number
        | null
        | {
          [key: string]: string | number | null
        }
      }
      headers?: { [key: string]: string }
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
      }
    },
  ): Promise<APIResponse> {
    const apiResponse = await this.request.post(process.env.BASE_API_URL + `${endpoint}`, options)

    // if (apiResponse.status() != 200) {
    //   const message = await apiResponse.json()
    //   return Promise.reject(message)
    // }

    return apiResponse
  }

  async ValidateSchema(response: APIResponse, schema: object): Promise<void> {
    const ajv = new Ajv()
    const responseJson = await response.json()
    const validateSchema = ajv.compile(schema)
    const isValid = validateSchema(responseJson)
    if (!isValid) {
      console.error("Schema validation errors:", validateSchema.errors)
    }
    expect(isValid).toBeTruthy()
  }

  async VerifyReturnStatus(response: APIResponse, status: number): Promise<void> {
    if (response.status() !== status) {
      throw new Error(`Test failed due to incorrect response status: ${response.status()}`)
    }
    expect(response.status()).toBe(status)
  }

  async VerifyResponseToContainText(response: APIResponse, text: string): Promise<void> {
    expect(await response.text()).toContain(text)
  }
}
