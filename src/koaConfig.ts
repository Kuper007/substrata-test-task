import * as Koa from 'koa';
import { router } from "./router";
const session = require('koa-session');
const logger = require('koa-morgan');

export class KoaConfig {
  private server: Koa;
  private port = Number(process.env.PORT) || 3030;

  constructor(server: Koa) {
    this.server = server;
  }

  init() {
    try {
      this.server.keys = ['initial secret'];
      this.server.use(session(this.server));
      this.server.use(logger('tiny'));
      this.server.use(router.routes());
      this.server.listen(this.port, () => {
        console.log(`Server is running on port ${this.port}`);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
