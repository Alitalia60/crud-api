import { ServerResponse } from 'http';

export const sendResponse = (response: ServerResponse, code: number, mes: string) => {
  response.writeHead(code, { 'Content-Type': 'application/JSON' });
  if (code >= 400) {
    if (typeof mes === 'string') {
      response.end(JSON.stringify({ Error: mes }));
    }
    else {
      response.end(JSON.stringify(mes));
    }

  } else {
    if (typeof mes === 'object') {
      response.end(JSON.stringify(mes));
    }
    else {
      response.end(JSON.stringify({ message: mes }));
    }
  }
};