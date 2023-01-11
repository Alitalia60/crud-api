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
  let id = '';
  let reqBodyJSON = '';
  let isCorrectData = true;

  if (req.method) {
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
      sendResponse(res, codesStatus.NotAllowed, 'Method not allowed');
      isCorrectData = false;
      return;
    }

    if (req.url?.match(/\/api\/users\/?/gm)) {
      id = req.url.split('/')[3];
      if (['PUT', 'DELETE', 'GET'].includes(req.method) && id) {
        if (!validate(id)) {
          sendResponse(res, codesStatus.BadRequest, 'User id is invalid (not uuid)');
          isCorrectData = false;
          return;
        }
      }
    }
    if (['PUT', 'POST'].includes(req.method)) {
      reqBodyJSON = await getBodyData(req);
      try {
        JSON.parse(reqBodyJSON);
      } catch (error) {
        sendResponse(res, codesStatus.BadRequest, `Wrong request data: ${error}`);
        isCorrectData = false;
        return;
      }

      const incorrectKeys: string[] = validateUserData(reqBodyJSON);
      if (incorrectKeys.length > 0) {
        sendResponse(res, codesStatus.BadRequest, `Incorrect/missing users key: ${incorrectKeys.toString()}`);
        isCorrectData = false;
        return;

      }
    }
    if (req.method === 'POST' && id) {
      sendResponse(res, codesStatus.BadRequest, 'Bad request. No id required');
      isCorrectData = false;
      return;
    }
  } else {
    sendResponse(res, codesStatus.NotAllowed, 'Method not allowed');
    isCorrectData = false;
    return;
  }

  if (process.send) {
    //отправка worker.id сообщения мастеру
    if (isCorrectData) {
      process.send({ workerId: cluster.worker?.id, cmd: req.method, userId: id, body: reqBodyJSON });
    }
  } else {
    // if router is Primary process (single-mode) & DB - is child
    DB?.once('message', (mes: TAnswer) => {
      if (mes.data) {
        sendResponse(res, mes.code, mes.data);
      } else if (mes.errMessage) {
        sendResponse(res, mes.code, mes.errMessage);
      } else {
        sendResponse(res, mes.code, '');
      }
    });
    DB?.send({ workerId: '', cmd: req.method, userId: id, body: reqBodyJSON });
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
};
