import { runServer } from './runServer';
import cluster, { Worker } from 'cluster';
import { loadBalancer } from './loadBalancer';
import { init } from './api/config/init';
import { router } from './api/routes/router';

const { PORT, MULTI, maxWorkers } = init();

if (!MULTI) {
  runServer(PORT, router)
}
else {
  if (cluster.isPrimary) {
    runServer(PORT, loadBalancer);

    for (let index = 0; index < maxWorkers; index++) {
      const worker: Worker = cluster.fork({ id: index + 1 });

      // worker.on('message', (mes) => {
      //   console.log(`worker ${worker.id} messge: ${mes}`);
      // })
    }

    cluster.on('message', (worker, mes) => {
      console.log(`cluster get message from worker:${worker.id}: ${mes}`);

    })

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker id: ${worker.id} died with code ${code}`);
    })

  }
  else {
    if (cluster.worker) {
      // console.log(process.env['id']);

      cluster.worker.send(`Worker:${cluster.worker.id} init.`)
      runServer(PORT, router, cluster.worker);
    }
    else {
      console.log('Worker not exist');
    }
  }
}