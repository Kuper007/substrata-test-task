import { IAuthService } from "../abstract/IAuthService";

export const HandleSignInAsync = async (authService: IAuthService): Promise<string> => {
  return authService.getAuthUrlAsync();
};