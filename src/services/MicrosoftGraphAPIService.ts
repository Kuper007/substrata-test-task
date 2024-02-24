import { IGraphAPIService } from "../abstract/IGraphAPIService";
import { Client } from "@microsoft/microsoft-graph-client";

export class MicrosoftGraphAPIService implements IGraphAPIService {
  constructor() {
  }

  async getMessagesLast5Async(accessToken: string): Promise<any> {
    const client: Client = Client.init({
      authProvider: (done: any) => {
        done(null, accessToken);
      },
    });

    return await client.api("/me/messages").top(5).get();
  }
}