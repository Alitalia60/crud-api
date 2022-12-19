import { IncomingMessage, ServerResponse } from 'http';
import { codesStatus } from '../helpers/codeStatuses';
import { isVvalidId } from '../validations/validateUser';

import { createUser, getUsers, getUser, deleteUser, updateUser } from '../contollers/userController';

export const mapRouter = (req: IncomingMessage, res: ServerResponse) => {
  console.log(req.url);

  if (req.url === '/api/users/') {
    switch (req.method) {
      case 'GET':
        getUsers(req, res);
        break;

      case 'POST':
        createUser(req, res);
        break;

      default:
        methodNotAllowed(req, res);
        break;
    }
  } else if (req.url?.match(/\/api\/users\/(.+)/gm)) {
    const id: string = req.url.split('/')[3];
    if (isVvalidId(id)) {
      res.writeHead(codesStatus.NotFound, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(`${id} not found`));
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
        methodNotAllowed(req, res);

        break;
    }
  }
  else {
    pathNotExist(req, res);
  }
}

function methodNotAllowed(req: IncomingMessage, res: ServerResponse): void {
  res.writeHead(codesStatus.NotAllowed, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify('Method not allowed'));

}
function pathNotExist(req: IncomingMessage, res: ServerResponse): void {
  res.writeHead(codesStatus.NotFound, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify('Route not exist'));

}