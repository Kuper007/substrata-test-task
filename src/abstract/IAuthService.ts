export interface IAuthService {
  getAuthUrlAsync(): Promise<string>;
  getTokenAsync(code: string): Promise<string>;
}