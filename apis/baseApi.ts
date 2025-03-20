import { APIRequest, APIRequestContext } from "@playwright/test";

export class BaseAPI {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }
}