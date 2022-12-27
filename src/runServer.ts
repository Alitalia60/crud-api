import { Worker } from 'cluster';
import http, { RequestListener, Server } from 'http';

const host = 'http://127.0.0.1';

export const runServer = (port: number, handler: RequestListener, worker: Worker | undefined = undefined): void => {

  const server: Server = http.createServer(handler);
  if (worker) {
    port += Number(process.env['id'])
  }

  server.listen(port, () => {
    console.log(`${worker ? 'worker' : 'server'} start at ${host}:${port}/`);
  });
}

