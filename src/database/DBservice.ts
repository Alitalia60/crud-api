// import { fork } from 'child_process';
import { codesStatus } from '../api/helpers/codeStatuses';
import { v4 as uuidv4 } from 'uuid';
import { TUser, TMessage, TResult, TError } from '../api/types/types';



let users: TUser[] = [];

// !! for testing purposes
// let users: TUser[] = [
//   {
//     id: '9db530b3-726c-487f-be5d-c80bef62bd58',
//     username: 'Andrew',
//     age: 26,
//     hobbies: ['fishing', 'hunting'],
//   },
//   {
//     id: '3db54dec-51fc-4725-acbf-f6808aa93231',
//     username: 'Jury',
//     age: 62,
//     hobbies: ['no'],
//   },
//   {
//     id: 'a688a856-7e62-4aa4-ab75-f7e07733b793',
//     username: 'Mary',
//     age: 28,
//     hobbies: ['Dance', 'Sings'],
//   },
// ];

class User implements TUser {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];

  constructor(userData: string) {
    const { username, age, hobbies } = JSON.parse(userData);
    this.id = uuidv4();
    this.username = username;
    this.age = age;
    this.hobbies = hobbies;
  }
}


// ******************************
class DBService {
  static get = async (id: string): Promise<TResult> => {
    return await new Promise((resolve, reject) => {
      try {
        if (id) {
          const foundUser = users.find(item => item.id === id);
          if (foundUser) {
            resolve([codesStatus.OK, foundUser]);
          }
          else {
            reject([codesStatus.NotFound, 'User id not found']);
          }
        } else {
          resolve([codesStatus.OK, users]);
        }
      } catch (error) {
        reject([codesStatus.ServerError, error]);
      }
    });
  };

  // ******************************
  static async add(data: string): Promise<TResult> {

    return await new Promise((resolve, reject) => {
      try {
        const newUser: User = new User(data);
        users.push(newUser);
        resolve([codesStatus.Created, newUser]);
      } catch (error) {
        reject([codesStatus.ServerError, error]);
      }
    });
  }
  // ******************************
  static async delete(id: string): Promise<TResult> {
    return await new Promise((resolve, reject) => {
      try {
        const findUser = users.find((user) => user.id === id);
        if (findUser) {
          users = users.filter((item) => item.id !== id);
          resolve([codesStatus.NoContent, undefined]);
        }
        else {
          reject([codesStatus.NotFound, 'User id not found']);
        }
      } catch (error) {
        reject([codesStatus.ServerError, error]);
      }
    });
  }

  // ******************************
  static async update(id: string, data: string): Promise<TResult> {
    return await new Promise((resolve, reject) => {
      try {
        const findUser: TUser | undefined = users.find(
          (user) => user.id === id
        );
        if (!findUser) {
          reject([codesStatus.NotFound, 'User id not found']);
        } else {
          const index: number = users.indexOf(findUser);
          Object.assign(users[index], JSON.parse(data));
          resolve([codesStatus.OK, users[index]]);
        }
      } catch (error) {
        reject([codesStatus.ServerError, error]);
      }
    });
  }
}

// ********************************************************
//mes = { worker: cluster.worker, cmd: req.method, userId: id, data:'' }

process.on('message', (mes: TMessage) => {

  switch (mes.cmd) {
  case 'GET':
    DBService.get(mes.userId)
    // DBService.get(mes.userId)
      .then(result => sendResult(mes.workerId, result))
      .catch(error => sendError(mes.workerId, error));
    break;
  case 'POST':

    DBService.add(mes.body)
    // DBService.get(mes.userId)
      .then(result => sendResult(mes.workerId, result))
      .catch(error => sendError(mes.workerId, error));
    break;
  case 'PUT':
    DBService.update(mes.userId, mes.body)
    // DBService.get(mes.userId)
      .then(result => sendResult(mes.workerId, result))
      .catch(error => sendError(mes.workerId, error));
    break;
  case 'DELETE':
    DBService.delete(mes.userId)
    // DBService.get(mes.userId)
      .then(result => sendResult(mes.workerId, result))
      .catch(error => sendError(mes.workerId, error));
    break;

  default:
    break;
  }
});

function sendResult(workerId: string, result: TResult): void {
  if (process.send) {
    const [code, data] = result;
    process.send(Object.assign({ workerId: workerId }, { code: code, data: data }));
  } else {
    console.log('1. DBService WHAT TO DO?');
  }

}

// function sendError(workerId: string, error: TError): void {
function sendError(workerId: string, error: TError): void {
  const [code, errMessage] = error;
  if (process.send) {
    process.send(Object.assign({ workerId: workerId }, { code: code, errMessage: errMessage }));
  }

}