import { runServer } from './runServer';
import cluster, { Worker } from 'cluster';
import { init } from './api/config/init';

export let { HOST, PORT, MULTI, maxWorkers } = init();

export type WorkerSetType = { child: Worker, workerPort: number };
let workersArray: WorkerSetType[] = [];

if (process.argv.slice(2) && process.argv.slice(2)[0] === '--multi') {
  MULTI = true;
}

if (!MULTI) {
  // single-mode
  runServer(PORT);
}
else {
  if (cluster.isPrimary) {

    for (let index = 1; index <= maxWorkers; index++) {
      const worker: Worker = cluster.fork({ workerPort: PORT + index });
      const set: WorkerSetType = { child: worker, workerPort: PORT + index };
      workersArray.push(set);
    }

    cluster.on('exit', (worker) => {
      console.log(`worker id: ${worker.id} died`);
      const freePort = workersArray.find(item => item.child === worker)?.workerPort;
      if (freePort) {
        const newWorker = cluster.fork({ workerPort: freePort });
        const set: WorkerSetType = { child: newWorker, workerPort: freePort };
        workersArray.push(set);
      }
    });
    runServer(PORT, workersArray);
  }
  else {
    // runServer(router, PORT, cluster.worker);
    runServer(PORT, cluster.worker);
  }
}