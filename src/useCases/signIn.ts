import { IAuthService } from "../types/IAuthService";

export const HandleSignInAsync = async (authService: IAuthService): Promise<string> => {
  return authService.getAuthUrlAsync();
};