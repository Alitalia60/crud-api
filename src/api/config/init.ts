import { config as dotenvConfig } from 'dotenv';
import { cpus } from 'node:os';

dotenvConfig();

export function init() {
  const HOST: string = process.env.HOST || 'localhost';
  const PORT: number = Number(process.env.PORT) || 4000;
  let MULTI: boolean = process.env.MULTI_MODE === 'true' ? true : false;
  const maxWorkers = cpus().length;
  return { HOST, PORT, MULTI, maxWorkers };

}
