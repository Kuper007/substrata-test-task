import { IAuthService } from "../abstract/IAuthService";

export const HandleGetTokenAsync = async (authService: IAuthService, code: string): Promise<string> => {
  return authService.getTokenAsync(code);
};