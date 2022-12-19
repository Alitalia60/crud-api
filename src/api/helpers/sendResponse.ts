import { ServerResponse } from 'http';

export const sendResponse = (response: ServerResponse, code: number, mes: Object | string) => {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  if (typeof mes === 'string') {
    response.end(JSON.stringify({ message: mes }));
  }
  else {
    response.end(JSON.stringify(mes));

  }

}