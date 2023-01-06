import { init } from '../config/init';
import cluster, { Worker } from 'cluster';
import { ChildProcess } from 'child_process';
import { WorkerSetType } from '../../api/types/types';

let { PORT, maxWorkers } = init();
let workersArray: WorkerSetType[] = [];

// export const createWorkers = (database: ChildProcess) => {
export const createWorkers = () => {
  for (let index = 1; index <= maxWorkers; index++) {
    const worker: Worker = cluster.fork({ workerPort: PORT + index });
    // const set: WorkerSetType = { child: worker, workerPort: PORT + index, DB: database };
    const set: WorkerSetType = { child: worker, workerPort: PORT + index };
    workersArray.push(set);
  }
  return workersArray;
}

// export const replaceDeadWorker = (worker: Worker, database: ChildProcess) => {
export const replaceDeadWorker = (worker: Worker) => {
  const freePort = workersArray.find(item => item.child === worker)?.workerPort;
  if (freePort) {
    const newWorker = cluster.fork({ workerPort: freePort });
    // const set: WorkerSetType = { child: newWorker, workerPort: freePort, DB: database };
    const set: WorkerSetType = { child: newWorker, workerPort: freePort };
    workersArray.push(set);
  }
}

export function nextWorker(): WorkerSetType | undefined {
  const firstWorker = workersArray.shift();
  if (firstWorker) {
    workersArray.push(firstWorker)
    return firstWorker
  }
  else return
}
