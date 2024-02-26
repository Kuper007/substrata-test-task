import { IAuthService } from "../types/IAuthService";
import { PublicClientApplication } from "@azure/msal-node";

export class AzureAuthService implements IAuthService {
  private publicClientApp: PublicClientApplication;
  private readonly redirectUri: string;
  private readonly scopes: string[];
  private readonly clientSecret: string;

  constructor(clientId: string, tenantId: string, redirectUri: string, scopes: string[], clientSecret: string) {
    this.redirectUri = redirectUri;
    this.scopes = scopes;
    this.clientSecret = clientSecret;

    const msalConfig = {
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri,
      },
    };

    this.publicClientApp = new PublicClientApplication(msalConfig);
  }

  async getAuthUrlAsync(): Promise<string> {
    const authCodeUrlParameters = {
      scopes: this.scopes,
      redirectUri: this.redirectUri,
    };

    return await this.publicClientApp.getAuthCodeUrl(authCodeUrlParameters);
  }

  async getTokenAsync(code: string): Promise<string> {
    const tokenRequest = {
      code,
      scopes: this.scopes,
      redirectUri: this.redirectUri,
      clientSecret: this.clientSecret,
    };

    const tokenResponse = await this.publicClientApp.acquireTokenByCode(tokenRequest);

    return tokenResponse.accessToken;
  }
}