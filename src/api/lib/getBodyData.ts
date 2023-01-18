import { IncomingMessage } from 'http';

export async function getBodyData(request: IncomingMessage): Promise<string> {
  return await new Promise((resolve, reject) => {
    try {
      let bodyData = '';
      request.on('data', data => {
        bodyData += data.toString();
      });
      request.on('end', () => resolve(bodyData));
    } catch (error) {
      reject(error);
    }
  });
} 