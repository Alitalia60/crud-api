import { fork, ChildProcess } from 'child_process';

export async function startDBService(): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    try {
      // const database = fork('./src/database/DBservice.ts', ['child']);
      const database = fork('./src/database/DBservice.ts', { env: { child: 'DB' } });

      database.on('spawn', () => {
        console.log('Database connected. pid: ', database.pid);
      });
      resolve(database);
    } catch (error) {
      reject(error);
    }
  });
}

