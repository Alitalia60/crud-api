import { getBodyData } from './api/services/getBodyData';
import { IncomingMessage, ServerResponse } from 'node:http'
import { sendResponse } from './api/helpers/sendResponse';
let nextWorkerId = 0;

export async function loadBalancer(request: IncomingMessage, response: ServerResponse) {
  const { method, url, } = request;
  // nextWorkerId = let nextWorkerId >;

  // console.log(request.headers);

  // let nextPort = port + nextWorkerId;
  let reqBody: string = '';
  // let config = {
  //   method: method,
  //   path: url,
  //   port: nextPort,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Content-Length': Buffer.byteLength(JSON.stringify(bodyData)),
  //   },
  // };

  // if (method) {
  //   if (['PUT', 'POST'].includes(method)) {
  //     reqBody = await getBodyData(request);
  //   }
  //   if (reqBody) {
  //     config = { method: method, body: JSON.stringify(reqBody) };
  //   }
  // };



  // const workerUrl = `${host}:${port + 1}${url}`;
  sendResponse(response, 200, 'LB response')
}
