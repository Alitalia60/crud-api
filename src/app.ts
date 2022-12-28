import { runServer } from './api/services/runServer';
import cluster, { Worker } from 'cluster';
import { init } from './api/config/init';
import { createWorkers, replaceDeadWorker } from './api/services/activeWorkers';

export let { PORT, MULTI } = init();

export type WorkerSetType = { child: Worker, workerPort: number };

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
    cluster.on('message', (worker, msg) => {
      console.log('message from worker ', worker.id);
    });

    workersArray.forEach(element => {
      element.child.send({ mes: ' mess to child ' })
    });

    runServer(PORT, true);
  }
  else {
    cluster.worker?.on('message', () => {
      console.log('get message by worker', cluster.worker?.id);

    })
    runServer(PORT, true, cluster.worker);
  }
}