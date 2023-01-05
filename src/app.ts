import { runServer } from './api/lib/runServer';
import cluster, { Worker } from 'cluster';
import { init } from './api/config/init';
import { createWorkers, replaceDeadWorker } from './api/lib/workersQueue';
// import { users, User } from './api/models/userModelDb';
import { fork } from 'child_process'
import process from 'node:process';

type TMessage = { workerId: string; cmd: string; id: string; data: string };

export let { PORT, MULTI } = init();

// export type WorkerSetType = { child: Worker, workerPort: number };

if (process.argv.slice(2) && process.argv.slice(2)[0] === '--multi') {
  MULTI = true;
}

if (!MULTI) {
  // single-mode
  const DB = fork('src/database/DBservice.ts');
  runServer(PORT);
}
else {

  if (cluster.isPrimary) {
    const DB = fork('src/database/DBservice.ts');

    DB.on('spawn', () => console.log('Database connected. pid: ', DB.pid))

    const workersArray = createWorkers();
    // сообщения от workers переслать БД
    workersArray.forEach(item => {
      item.child.on('message', mes => {
        //переадресовка к БД
        DB.send(mes);
      });
    });

    type TAnswer = { workerId: number, code: number, data: string | Object, errMessage: string | undefined }

    DB.on('message', (mes: TAnswer) => {
      if (mes.workerId && cluster.workers) {
        const { workerId, code, data, errMessage } = mes;
        cluster.workers[workerId]?.send({ code: code, data: data, err: errMessage })
      }
    })

    cluster.on('exit', (worker) => {
      // if worker dead, his port became free - start new worker
      console.log(`worker id: ${worker.id} is dead`);
      replaceDeadWorker(worker);
    });
    runServer(PORT, true);

  } else {
    runServer(PORT, true, cluster.worker);
  }
}
