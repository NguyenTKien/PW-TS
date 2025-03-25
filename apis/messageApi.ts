import { APIRequestContext, expect } from "@playwright/test";
import { BaseAPI } from "./baseApi";

const messagePath = process.env.BASE_API_URL + "/message/";

export class MessageApi extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getMessage() {
    const response = await this.request.get(messagePath);
    expect(response.status()).toBe(200);
    return response;
  }

  async deleteMessage(messageId: number) {
    const repsonse = await this.request.delete(messagePath + `${messageId}`);
    expect(repsonse.status()).toBe(200);
  }

  async deleteAllMessage() {
    const responseMessage = await this.getMessage();
    const getMessageData = await responseMessage.json();
    const listMessages = getMessageData.messages;
    const messagesId: { id: number }[] = listMessages.map(
      (message: { id: number }) => message
    );
    for (const message of messagesId) await this.deleteMessage(message.id);
  }
}
