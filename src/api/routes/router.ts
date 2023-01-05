import { IncomingMessage, ServerResponse } from 'http';
import { validate } from 'uuid';
import cluster from 'node:cluster';

import { codesStatus } from '../helpers/codeStatuses';
import { sendResponse } from '../helpers/sendResponse';
import { getBodyData } from '../lib/getBodyData';


export const router = async (req: IncomingMessage, res: ServerResponse) => {
  let id: string = '';
  let reqBodyJSON: string = '';
  if (req.method && ['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    if (['POST', 'PUT'].includes(req.method)) {
      reqBodyJSON = await getBodyData(req);

    }
    if (req.url?.match(/\/api\/users\/?/gm)) {
      if (req.url?.match(/\/api\/users\/(.+)/gm)) {
        id = req.url.split('/')[3];
        if (!validate(id)) {
          sendResponse(res, codesStatus.BadRequest, `id not valid`)
          return
        }
        if (id && req.method === 'POST') {
          sendResponse(res, codesStatus.NotAllowed, 'Method not allowed')
          return
        }
      }
    } else {
      sendResponse(res, codesStatus.NotFound, 'Route not exist')
    }
  } else {
    sendResponse(res, codesStatus.NotAllowed, 'Method not allowed')
  };

  if (process.send) {
    //отправка worker.id сообщения мастеру
    process.send({ workerId: cluster.worker?.id, cmd: req.method, userId: id, body: reqBodyJSON })
  } else {
    // Single-mode: Primary посылает запрос к БД
  }

  type TAnswer = { code: number, data: Object | undefined, err: string }
  process.on('message', (mes: TAnswer) => {
    if (mes.data) {
      sendResponse(res, mes.code, mes.data)
    } else {
      sendResponse(res, mes.code, mes.err)
    }

  })
}
