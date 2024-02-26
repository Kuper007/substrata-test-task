import { IGraphAPIService } from "../types/IGraphAPIService";

export const HandleGetEmailsLast5Async = async (graphService: IGraphAPIService, accessToken: string): Promise<string> => {
    return graphService.getMessagesLast5Async(accessToken);
};