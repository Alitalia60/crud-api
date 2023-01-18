import { Worker } from 'cluster';
import { createServer, Server } from 'http';

import { router } from '../routes/router';
import { balancer } from '../routes/balancer';


export function runServer(port: number, multiMode = false, worker: Worker | undefined = undefined): void {

  if (worker) {
    port = Number(process.env['workerPort']);
    const server: Server = createServer(router);
    server.listen(port, () => {
      console.log(`worker ${worker.id} start at ${port} pid: `, process.pid);
    });

  }
  else {
    const server: Server = createServer(multiMode ? balancer : router);
    server.listen(port, () => {
      console.log(`Server ${multiMode ? '(balancer) ' : ''}start at ${port}, pid: `, process.pid);
    });

  }
}