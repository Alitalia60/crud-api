import { init } from '../config/init';
import cluster, { Worker } from 'cluster';

let { PORT, maxWorkers } = init();
type WorkerSetType = { child: Worker, workerPort: number };
let workersArray: WorkerSetType[] = [];

export const createWorkers = () => {
  for (let index = 1; index <= maxWorkers; index++) {
    const worker: Worker = cluster.fork({ workerPort: PORT + index });
    const set: WorkerSetType = { child: worker, workerPort: PORT + index };
    workersArray.push(set);
  }
  return workersArray;
}

export const replaceDeadWorker = (worker: Worker) => {
  const freePort = workersArray.find(item => item.child === worker)?.workerPort;
  if (freePort) {
    const newWorker = cluster.fork({ workerPort: freePort });
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
