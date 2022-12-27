import { IncomingMessage, ServerResponse } from 'http';
import { validate } from 'uuid';

import { codesStatus } from '../helpers/codeStatuses';
import { sendResponse } from '../helpers/sendResponse';
import { createUser, getUsers, getUser, deleteUser, updateUser } from '../controllers/userController';

export const router = (req: IncomingMessage, res: ServerResponse) => {

  if (req.url === '/api/users/') {
    switch (req.method) {
      case 'GET':
        getUsers(req, res);
        break;

      case 'POST':
        createUser(req, res);
        break;

      default:
        sendResponse(res, codesStatus.NotAllowed, 'Method not allowed')
        break;
    }
  } else if (req.url?.match(/\/api\/users\/(.+)/gm)) {
    const id: string = req.url.split('/')[3];
    if (!validate(id)) {
      sendResponse(res, codesStatus.NotFound, `id not valid`)
      return
    }
    switch (req.method) {

      case 'GET':
        getUser(req, res, id);
        break;

      case 'PUT':
        updateUser(req, res, id);
        break;

      case 'DELETE':
        deleteUser(req, res, id);
        break;

      default:
        sendResponse(res, codesStatus.NotAllowed, 'Method not allowed')
        break;
    }
  }
  else {
    sendResponse(res, codesStatus.NotFound, 'Route not exist')
  }
}