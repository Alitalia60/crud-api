import { fork, ChildProcess } from 'child_process';

export class ChildDatabase {
  base: ChildProcess;

  constructor(childUrl: string) {
    this.base = fork(childUrl);
  }

  sendMessage(mes: string): void {
    this.base.send(mes);
  }

}


export function startCP(url: string) {
  const forkFile = fork(url);
  forkFile.on('spawn', () => console.log('Database connected. pid: ', forkFile.pid));
  return () => forkFile;
}