import { runServer } from './api/lib/runServer';
import cluster from 'cluster';
import { init } from './api/config/init';
import { createWorkers, replaceDeadWorker } from './api/lib/workersQueue';
import process, { report } from 'node:process';
import { TAnswer } from './api/types/types';
import { fork, ChildProcess } from 'child_process';

export let { PORT, MULTI } = init();

export let DB: ChildProcess | undefined = undefined;

if (process.argv.slice(2) && process.argv.slice(2)[0] === '--multi') {
  MULTI = true;
}

//!! single-mode
async function app() {

  if (!MULTI) {
    // single-mode
    DB = createFork();
    runServer(PORT);
  }

  else {
    if (cluster.isPrimary) {
      DB = createFork();

      DB?.on('message', (mes: TAnswer) => {
        if (mes.workerId && cluster.workers) {
          const { workerId, code, data, errMessage } = mes;
          cluster.workers[workerId]?.send({ code: code, data: data, err: errMessage })
        }
      })

      const workersArray = createWorkers();
      // сообщения от workers переслать БД
      workersArray.forEach(item => {
        item.child.on('message', mes => {
          //переадресовка к БД
          // DB.send(Object.assign(mes, { DB: DB }));
          DB?.send(Object.assign(mes));
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
}


export function createFork() {
  const database = fork('src/database/DBservice.ts');
  database.on('spawn', () => console.log('Database connected. pid: ', database.pid))
  return database;
}
app()
