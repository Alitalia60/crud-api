import { runServer } from './api/lib/runServer';
import cluster from 'cluster';
import { init } from './api/config/init';
import { createWorkers, replaceDeadWorker } from './api/lib/workersQueue';
import process from 'node:process';
import { TAnswer } from './api/types/types';
import { fork, ChildProcess } from 'child_process';
import { resolve } from 'path';

export const PORT = init().PORT;

export let MULTI = false;

export let DB: ChildProcess | undefined = undefined;

if (process.argv.slice(2) && process.argv.slice(2)[0] === '--multi') {
  MULTI = true;
}

if (!MULTI) {
  // single-mode
  console.log('-----------------------------------');
  console.log('Server runs at single-mode');
  console.log('-----------------------------------');
  console.log();


  DB = createFork();
  runServer(PORT);
}

else {
  if (cluster.isPrimary) {
    console.log('-----------------------------------');
    console.log('Server runs at cluster-mode (MULTI)');
    console.log('-----------------------------------');
    console.log();
    DB = createFork();

    DB?.on('message', (mes: TAnswer) => {
      if (mes.workerId && cluster.workers) {
        const { workerId, code, data, errMessage } = mes;
        cluster.workers[workerId]?.send({ code: code, data: data, err: errMessage });
      }
    });

    type TReq = { workerId: string, cmd: string, userId: string, body: string }
    const workersArray = createWorkers();
    // сообщения от workers переслать БД
    workersArray.forEach(item => {
      item.child.on('message', (mes: TReq) => {
        //переадресовка к БД
        DB?.send(mes);
      });
    });

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

export function createFork() {

  const DBUrl = resolve(__dirname, 'database/DBservice');
  const database = fork(DBUrl);
  database.on('spawn', () => console.log('Database connected. pid: ', database.pid));
  return database;
}