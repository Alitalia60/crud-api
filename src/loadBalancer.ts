import { getBodyData } from './api/services/getBodyData';
import { IncomingMessage, ServerResponse } from 'node:http'
import { sendResponse } from './api/helpers/sendResponse';
// import nodeCluster from 'node:cluster';
import { nextWorkerPort } from './api/services/activeWorkers';
import http from 'node:http';
import { codesStatus } from './api/helpers/codeStatuses';

let nextPort: number = 0;

export async function loadBalancer(request: IncomingMessage, response: ServerResponse) {

  const { method, url, } = request;

  const nextPort = nextWorkerPort();

  let reqBody: string = '';
  if (method) {
    if (['PUT', 'POST'].includes(method)) {
      reqBody = await getBodyData(request);
    }
  };

  let config = {
    // host: request.headers.host,
    method: method,
    path: url,
    port: nextPort,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(reqBody),
    },
  };

  const requestLB = http.request(config, async (workerResponse: IncomingMessage) => {
    if (config.method) {

      let resBody: string = await getBodyData(workerResponse);

      try {
        sendResponse(response, workerResponse.statusCode ? workerResponse.statusCode : codesStatus.ServerError, JSON.parse(resBody))
      } catch (error) {
        sendResponse(response, workerResponse.statusCode ? workerResponse.statusCode : codesStatus.ServerError, error ? error : 'Unknon error');
      }
    } else {
      sendResponse(response, codesStatus.ServerError, 'Method not valid');
    }
  });
  requestLB.end(reqBody)
}
