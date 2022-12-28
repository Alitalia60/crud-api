import { Worker } from 'cluster';
import { createServer, Server } from 'http';

import { router } from './api/routes/router';
import { loadBalancer } from './loadBalancer';


export function runServer(port: number, multiMode: boolean = false, worker: Worker | undefined = undefined): void {

  // if (worker && multiMode) {
  if (worker) {
    //it is a worker
    port = Number(process.env['workerPort'])
    const server: Server = createServer(router);
    server.listen(port, () => {
      console.log(`worker ${worker.id} start at ${port} pid: ${process.pid}`);
    });
  }
  else {
    const server: Server = createServer(multiMode ? loadBalancer : router);
    server.listen(port, () => {
      console.log(`Server ${multiMode ? '(LB) ' : ''}start at ${port}`);
    });

  }
}