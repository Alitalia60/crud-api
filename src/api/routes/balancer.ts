import { ClientRequest, IncomingMessage, ServerResponse, request as httpRequest } from 'node:http'

import { getBodyData } from '../lib/getBodyData';
import { sendResponse } from '../helpers/sendResponse';
import { nextWorker } from '../lib/workersQueue';
import { codesStatus } from '../helpers/codeStatuses';

// let nextPort: number = 0;

export async function balancer(request: IncomingMessage, response: ServerResponse) {

  const { method, url, } = request;

  const nextQueue = nextWorker();
  const nextPort = nextQueue?.workerPort;

  let reqBody: string = '';
  if (method) {
    if (['PUT', 'POST'].includes(method)) {
      reqBody = await getBodyData(request);
    }
  };

  // перенаправление запроса к worker
  let config = {
    method: method,
    path: url,
    port: nextPort,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(reqBody),
    },
  };

  const requestLB: ClientRequest = httpRequest(config, async (workerResponse: IncomingMessage) => {

    if (config.method) {
      try {
        let resBodyJSON: string = await getBodyData(workerResponse);
        sendResponse(response, workerResponse.statusCode ? workerResponse.statusCode : codesStatus.ServerError, resBodyJSON ? JSON.parse(resBodyJSON) : '');

      } catch (error) {
        console.log(`LB response error :${error}`);
        sendResponse(response, codesStatus.ServerError, error ? error : 'Unknon error');
      }
    } else {
      sendResponse(response, codesStatus.ServerError, 'Method not valid');
    }
  });
  requestLB.end(reqBody)
}
