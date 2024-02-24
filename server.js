require('dotenv').config();

const Koa = require('koa');

const logger = require('koa-morgan');
const Router = require('koa-router');
const { koaBody } = require('koa-body');

const fetch = require('isomorphic-fetch');
const { Client } = require("@microsoft/microsoft-graph-client");
const { PublicClientApplication, ConfidentialClientApplication } = require("@azure/msal-node");

const clientId = process.env.MS_CLIENT_ID;
const redirectUri = `http://localhost:${process.env.PORT}/redirect`;
const tenantId = process.env.MS_TENANT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
};

const pca = new PublicClientApplication(msalConfig);

const ccaConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    clientSecret,
  },
};

const cca = new ConfidentialClientApplication(ccaConfig);

const scopes = ["https://graph.microsoft.com/.default"];


const server = new Koa();

const router = new Router()

router.get('/', ctx => {
  ctx.body = 'I am root!'
});

router.post('/something', ctx => {
  ctx.body = {
    something: 'something here'
  }
})

router.post('/comments', koaBody(), async ctx => {
  console.log(ctx.request.body);
  // => POST body
  ctx.body = JSON.stringify(ctx.request.body);
})

router.get('/signin', async (ctx) => {

  const authCodeUrlParameters = {
    scopes,
    redirectUri,
  };


  try {
    const response = await pca.getAuthCodeUrl(authCodeUrlParameters)
    ctx.redirect(response);
  } catch (error) {
    ctx.throw(500, 'Failed to retrieve authorization URL');
  }
});

// Middleware to handle authentication callback
router.get('/redirect', async (ctx, next) => {
  const tokenRequest = {
    code: ctx.request.query.code,
    scopes,
    redirectUri,
    clientSecret,
  };
  console.log(clientSecret)


  try {

    const tokenResponse = await pca.acquireTokenByCode(tokenRequest);
    console.log("*****Token*****:", tokenResponse)
    ctx.state.accessToken = tokenResponse.accessToken;
    await next();
  } catch (error) {
    console.log(error)
    ctx.throw(401, 'Authentication failed');
  }
});

// Route to retrieve user data
router.get('/user', async (ctx) => {
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: {
      Authorization: `Bearer ${ctx.state.accessToken}`,
    },
  });

  if (!response.ok) {
    ctx.throw(response.status, 'Failed to fetch user data');
  }

  const userData = await response.json();
  ctx.body = userData;
});


server
  .use(logger('tiny'))
  .use(router.routes())
  .listen(process.env.PORT);