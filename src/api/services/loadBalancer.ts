import { getBodyData } from './getBodyData';
import { IncomingMessage, ServerResponse } from 'node:http'
import { sendResponse } from '../helpers/sendResponse';
// import nodeCluster from 'node:cluster';
import { nextWorker } from './activeWorkers';
import http from 'node:http';
import { codesStatus } from '../helpers/codeStatuses';

let nextPort: number = 0;

export async function loadBalancer(request: IncomingMessage, response: ServerResponse) {

  const { method, url, } = request;

  const nextQueue = nextWorker();
  const nextPort = nextQueue?.workerPort;
  nextQueue?.child.send({ mes: 'nextQueueWorker from LB' })

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
