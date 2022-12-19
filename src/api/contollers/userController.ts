import { codesStatus } from '../helpers/codeStatuses';
import { IncomingMessage, ServerResponse } from 'http';
import { users } from "../DataBase/users";
import { User } from "../models/userModel";
import { getBodyData } from "../services/getBodyData";
import { typeUser } from 'api/DataBase/users';
/********************************************************
* @desc
* @route
*/
export async function getUsers(request: IncomingMessage, response: ServerResponse) {
  try {
    let users = await User.findAll();
    response.writeHead(codesStatus.OK, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(users));

  } catch (error) {
    response.writeHead(codesStatus.NotFound, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({}));
  }

}

/********************************************************
* @desc
* @route
*/
export async function getUser(request: IncomingMessage, response: ServerResponse, id: string) {

  try {
    const user = await User.findById(id);

    if (!user) {
      response.writeHead(codesStatus.NotFound, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'User not found' }));
    }
    else {
      response.writeHead(codesStatus.OK, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(user));
    }
  } catch (error) {
    response.writeHead(codesStatus.ServerError, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Internal server error' }));

  }
}

/********************************************************
* @desc
* @route
*/
export async function createUser(request: IncomingMessage, response: ServerResponse) {
  try {
    let bodyData = await getBodyData(request);
    const user = await User.createUser(bodyData);
    response.writeHead(codesStatus.Created, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(user));
  } catch (error) {
    response.writeHead(codesStatus.ServerError, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Server error' }));

  }
}

/********************************************************
* @desc
* @route
*/
export async function updateUser(request: IncomingMessage, response: ServerResponse, id: string) {
  // try {

  //   const user = await User.findById(id);
  //   if (!user) {
  //     response.writeHead(400, { 'Content-Type': 'application/json' });
  //     response.end(JSON.stringify({ message: 'User not found' }));
  //   }
  //   else {
  //     response.writeHead(200, { 'Content-Type': 'application/json' });
  //     response.end(JSON.stringify(user));
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  // response.writeHead(400, { 'Content-Type': 'application/json' });
  // response.end(JSON.stringify({ message: 'Not implemented' }));
}

/********************************************************
  * @desc
  * @route
  */
export async function deleteUser(request: IncomingMessage, response: ServerResponse, id: string) {
  // response.writeHead(400, { 'Content-Type': 'application/json' });
  // response.end(JSON.stringify({ message: 'Not implemented' }));
}
