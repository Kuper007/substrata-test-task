export interface IGraphAPIService {
  getMessagesLast5Async(accessToken: string): Promise<any>;
}