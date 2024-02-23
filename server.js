require('dotenv').config();

const Koa = require('koa');
const session = require('koa-session');

const logger = require('koa-morgan');
const Router = require('koa-router');
const { koaBody } = require('koa-body');

const fetch = require('isomorphic-fetch');
const { PublicClientApplication } = require("@azure/msal-node");
const { Client } = require("@microsoft/microsoft-graph-client");

const clientId = process.env.MS_CLIENT_ID;
const redirectUri = `http://localhost:${process.env.PORT}/redirect`;
const tenantId = process.env.MS_TENANT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;


const koaOptions = {
  origin: true,
  credentials: true
};

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
};

const pca = new PublicClientApplication(msalConfig);

const scopes = ["https://graph.microsoft.com/Mail.Read"];

const server = new Koa();


server.keys = ['initial secret'];
server.use(session(server));

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

  try {
    const tokenResponse = await pca.acquireTokenByCode(tokenRequest);
    const accessToken = tokenResponse.accessToken;
    ctx.session.accessToken =  accessToken;


    await next();
  } catch (error) {
    console.log(error)
    ctx.throw(401, 'Authentication failed');
  }
});

// Route to retrieve user data
router.get('/emails', async (ctx, next) => {
  const accessToken = ctx.session.accessToken;
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  const messages = await client.api("/me/messages").top(5).get();

  console.log("messages: ", messages);

  ctx.body = messages;
  await next();
});

server
  .use(logger('tiny'))
  .use(router.routes())
  .listen(process.env.PORT);