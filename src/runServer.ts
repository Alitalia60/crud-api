import { Worker } from 'cluster';
import { createServer, Server } from 'http';

import { HOST, WorkerSetType } from './app'
import { router } from './api/routes/router';
import { loadBalancer } from './loadBalancer';


export function runServer(
  port: number,
  worker: Worker | Array<WorkerSetType> | undefined = undefined
): void {

  if (worker) {
    if (!Array.isArray(worker)) {
      //it is worker
      port = Number(process.env['workerPort'])
      const server: Server = createServer(router);
      server.listen(port, () => {
        console.log(`worker ${worker.id} start at ${HOST}:${port}/ pid: ${process.pid}`);
      });
    }
    else {
      //it is Primary (parent)
      const server: Server = createServer(loadBalancer);
      server.listen(port, () => {
        console.log(`Server(LB) start at ${HOST}:${port}/`);
      });
    }
  }
  else {
    //single mode
    const server: Server = createServer(router);
    server.listen(port, () => {
      console.log(`Server start at ${HOST}:${port}/`);
    });
  }
}

// export { runServer }
