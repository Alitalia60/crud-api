import { ClientRequest, IncomingMessage, ServerResponse, request as httpRequest } from 'node:http';

import { getBodyData } from '../lib/getBodyData';
import { sendResponse } from '../helpers/sendResponse';
import { nextWorker } from '../lib/workersQueue';
import { codesStatus } from '../helpers/codeStatuses';

export async function balancer(request: IncomingMessage, response: ServerResponse) {

  const { method, url } = request;

  const nextQueue = nextWorker();

  // !! DEBUG purpose : check if next port used
  // console.log(`Workers port: ${nextQueue?.workerPort} used`);

  const nextPort = nextQueue?.workerPort;

  let reqBody = '';
  if (method) {
    if (['PUT', 'POST'].includes(method)) {
      reqBody = await getBodyData(request);
    }
  }

  // перенаправление запроса к worker
  const config = {
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
        const resBodyJSON: string = await getBodyData(workerResponse);
        sendResponse(response, workerResponse.statusCode ? workerResponse.statusCode : codesStatus.ServerError, resBodyJSON ? JSON.parse(resBodyJSON) : '');

      } catch (error) {
        console.log(`LB response error :${error}`);
        if (typeof error === 'string') {
          sendResponse(response, codesStatus.ServerError, error);
        } else {
          sendResponse(response, codesStatus.ServerError, 'Unknon error');
        }
      }
    } else {
      sendResponse(response, codesStatus.ServerError, 'Method not valid');
    }
  });
  requestLB.end(reqBody);
}