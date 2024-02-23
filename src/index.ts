import * as Koa from 'koa';
import { KoaConfig } from "./koaConfig";

// @ts-ignore
const fetch = require('isomorphic-fetch');
require('dotenv').config();

const server: Koa = new Koa();
const koaConfig = new KoaConfig(server);

koaConfig.init();
