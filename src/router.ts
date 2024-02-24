import { IAuthService } from "./types/IAuthService";
import { AzureAuthService } from "./services/AzureAuthService";
import { IGraphAPIService } from "./types/IGraphAPIService";
import { MicrosoftGraphAPIService } from "./services/MicrosoftGraphAPIService";
import * as Router from "koa-router";
import * as Koa from "koa";
import { HandleSignInAsync } from "./useCases/signIn";
import { HandleGetTokenAsync } from "./useCases/getToken";
import { HandleGetEmailsLast5Async } from "./useCases/getEmailsLast5";

require('dotenv').config();

const port = Number(process.env.PORT) || 3030;

const clientId = process.env.MS_CLIENT_ID;
const redirectUri = `http://localhost:${port}/auth-response`;
const tenantId = process.env.MS_TENANT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;
const scopes: string[] = [process.env.MS_SCOPE];

const authService: IAuthService = new AzureAuthService(
  clientId,
  tenantId,
  redirectUri,
  scopes,
  clientSecret
);

const graphAPIService: IGraphAPIService = new MicrosoftGraphAPIService();

const router: Router = new Router();

router.get('/signin', async (ctx: Koa.Context): Promise<void> => {
  try {
    const response = await HandleSignInAsync(authService);
    ctx.redirect(response);
  } catch (error) {
    ctx.throw(500, 'Failed to retrieve authorization URL');
  }
});

router.get('/auth-response', async (ctx: Koa.Context): Promise<void> => {
  try {
    ctx.session.accessToken = await HandleGetTokenAsync(authService,  ctx.request.query.code as string);

    ctx.body = {
      status:  200,
      message: 'User authorized successfully',
    };
  } catch (error) {
    console.log(error)
    ctx.throw(401, 'Authentication failed');
  }
});

router.get('/emails', async (ctx: Koa.Context): Promise<void> => {
  try {
    const accessToken: string = ctx.session.accessToken;

    if(!accessToken) {
      ctx.throw(401, 'User not authenticated. Please sign in first');
    }

    const messages: any = await HandleGetEmailsLast5Async(graphAPIService, accessToken);

    console.log("messages: ", messages);
    ctx.body = messages;
  } catch (error) {
    console.log(error)
    ctx.throw(500, ' Internal Server Error');
  }
});

export { router };
