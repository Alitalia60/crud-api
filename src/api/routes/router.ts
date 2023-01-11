import { IncomingMessage, ServerResponse } from 'http';
import { validate } from 'uuid';
import cluster from 'node:cluster';

import { codesStatus } from '../helpers/codeStatuses';
import { sendResponse } from '../helpers/sendResponse';
import { getBodyData } from '../lib/getBodyData';
import { DB } from '../../app';
import { TAnswer } from '../../api/types/types';
import { validateUserData } from '../validations/validateUserData';

export const router = async (req: IncomingMessage, res: ServerResponse) => {

  let isCorrectData = true;

  if (!req.headers['content-type']?.toLowerCase().includes('json')) {
    sendResponse(res, codesStatus.BadRequest, 'Bad request. JSON expected');
    isCorrectData = false;
    return;

  }

  let reqBodyJSON = '';

  const method = <string>req.method;
  const url = <string>req.url;
  const id = url.split('/')[3];

  if (url !== '/api/users' && !url.match(/\/api\/users\//gm)) {
    sendResponse(res, codesStatus.NotFound, 'Path not found');
    isCorrectData = false;
    return;

  } else if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
    sendResponse(res, codesStatus.NotAllowed, 'Method not allowed');
    isCorrectData = false;
    return;

  } else if (id && id.length !== 36) {
    sendResponse(res, codesStatus.NotFound, 'Path not found');
    isCorrectData = false;
    return;

  } else if (method === 'POST' && id) {
    sendResponse(res, codesStatus.BadRequest, 'Bad request. No id required');
    isCorrectData = false;
    return;

  } else if (['PUT', 'DELETE', 'GET'].includes(method) && id) {
    if (!validate(id)) {
      sendResponse(res, codesStatus.BadRequest, 'User id is invalid (not uuid)');
      isCorrectData = false;
      return;
    }
  }

  if (['POST', 'PUT'].includes(method)) {

    try {
      reqBodyJSON = await getBodyData(req);

      const incorrectKeys: string[] = validateUserData(reqBodyJSON);
      if (incorrectKeys.length > 0) {
        sendResponse(res, codesStatus.BadRequest, `Wrong/missing data: ${incorrectKeys.toString()}`);
        isCorrectData = false;
        return;
      }
    } catch (error) {
      sendResponse(res, codesStatus.BadRequest, 'Bad body data');
      isCorrectData = false;

    }
  }

  if (isCorrectData) {
    if (process.send) {
      //отправка worker.id сообщения мастеру
      process.send({ workerId: cluster.worker?.id, cmd: req.method, userId: id, body: reqBodyJSON });

    } else {
      // if router is Primary process (single-mode) & DB - is child
      DB?.send({ workerId: '', cmd: req.method, userId: id, body: reqBodyJSON });

      DB?.once('message', (mes: TAnswer) => {
        if (mes.data) {
          sendResponse(res, mes.code, mes.data);
        } else if (mes.errMessage) {
          sendResponse(res, mes.code, mes.errMessage);
        } else {
          sendResponse(res, mes.code, '');
        }
      });
    }

    // if router is worker
    process.removeAllListeners('message');

    process.once('message', (mes: TAnswer) => {
      if (mes.data) {
        sendResponse(res, mes.code, mes.data);
      } else if (mes.errMessage) {
        sendResponse(res, mes.code, mes.errMessage);
      } else {
        sendResponse(res, mes.code, '');
      }
    });
  }
};