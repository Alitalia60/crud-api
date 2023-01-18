import { Worker } from 'node:cluster';

export type TUser = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type TMessage = { workerId: string; cmd: string; userId: string; body: string };
export type TAnswer = { workerId: number, code: number, data: string, errMessage: string | undefined }
export type TResult = [number, TUser | TUser[] | undefined];
export type TError = [number, string];
export type WorkerSetType = { child: Worker, workerPort: number };
