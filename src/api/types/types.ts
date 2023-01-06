import { ChildProcess } from 'node:child_process';
import { Worker } from 'node:cluster';

export type TUser = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type TMessage = { workerId: string; cmd: string; userId: string; body: string };
export type TAnswer = { workerId: number, code: number, data: string | Object, errMessage: string | undefined }
// type TAnswer = { code: number, data: Object | undefined, err: string }
export type TResult = [number, TUser | TUser[] | undefined];
export type TError = [number, string];

// export type WorkerSetType = { child: Worker, workerPort: number, DB: ChildProcess };
export type WorkerSetType = { child: Worker, workerPort: number };
