import { IncomingMessage } from 'http';
// import { typeUser } from 'api/DataBase/users';

export async function getBodyData(request: IncomingMessage): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      let bodyData = '';
      request.on('data', data => {
        bodyData += data.toString();
      })
      request.on('end', () => resolve(bodyData))
    } catch (error) {
      reject(error)
    }
  })
} 