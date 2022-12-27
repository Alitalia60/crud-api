import dotenv from 'dotenv';
import { cpus } from 'node:os';

dotenv.config();

export function init() {
  const HOST: string = process.env.HOST || 'localhost';
  const PORT: number = Number(process.env.PORT) || 3000;
  const MULTI: boolean = process.env.MULTI_MODE === 'true' ? true : false;
  const maxWorkers = cpus().length;
  return { HOST, PORT, MULTI, maxWorkers };

}
