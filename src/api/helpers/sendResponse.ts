import { ServerResponse } from 'http';

export const sendResponse = (response: ServerResponse, code: number, mes: Object | string) => {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  if (code >= 400) {
    if (typeof mes === 'string') {
      response.end(JSON.stringify({ Error: mes }));
    }
    else {
      response.end(JSON.stringify(mes));
    }

  } else {
    if (typeof mes === 'string') {
      response.end(JSON.stringify({ message: mes }));
    }
    else {
      response.end(JSON.stringify(mes));
    }
  }

}