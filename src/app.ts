import { runServer } from './runServer';
import cluster, { Worker } from 'cluster';
import { init } from './api/config/init';
import { createWorkers, replaceDeadWorker } from './api/services/activeWorkers';

export let { PORT, MULTI } = init();

export type WorkerSetType = { child: Worker, workerPort: number };
// let workersArray: WorkerSetType[] = [];

if (process.argv.slice(2) && process.argv.slice(2)[0] === '--multi') {
  MULTI = true;
}


if (!MULTI) {
  // single-mode
  runServer(PORT);
}
else {
  if (cluster.isPrimary) {
    const workersArray = createWorkers();

    cluster.on('exit', (worker) => {
      // if worker dead, his port became free - start new worker
      console.log(`worker id: ${worker.id} dead`);
      replaceDeadWorker(worker);
    });

    runServer(PORT, true);
  }
  else {
    runServer(PORT, true, cluster.worker);
  }
}