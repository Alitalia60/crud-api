import { codesStatus } from '../helpers/codeStatuses';
import { isValidUserData } from '../validations/validateUser';
import { IncomingMessage, ServerResponse } from 'http';
import { User } from "../models/userModel";
import { getBodyData } from "../services/getBodyData";
import { sendResponse } from '../helpers/sendResponse';
/********************************************************
* @desc
* @route
*/
export async function getUsers(request: IncomingMessage, response: ServerResponse) {
  try {
    let users = await User.findAll();
    sendResponse(response, codesStatus.OK, users);

  } catch (error) {
    sendResponse(response, codesStatus.NotFound, 'Not found');
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
      sendResponse(response, codesStatus.NotFound, 'User not found');
    }
    else {
      sendResponse(response, codesStatus.OK, user);
    }
  } catch (error) {
    console.log(error);

    sendResponse(response, codesStatus.ServerError, 'Internal server error');

  }
}

/********************************************************
* @desc
* @route
*/
export async function createUser(request: IncomingMessage, response: ServerResponse) {
  try {
    let bodyData = await getBodyData(request);

    if (!isValidUserData(bodyData)) {
      sendResponse(response, codesStatus.BadRequest, 'Invalid user data');
      return
    };

    const user = await User.createUser(bodyData);
    sendResponse(response, codesStatus.Created, user);

  } catch (error) {
    sendResponse(response, codesStatus.ServerError, 'Server error');
  }
}

/********************************************************
* @desc
* @route
*/
export async function updateUser(request: IncomingMessage, response: ServerResponse, id: string) {
  try {
    const user = await User.findById(id);

    if (!user) {
      sendResponse(response, codesStatus.NotFound, 'User not found');
      return
    }
    else {
      let bodyData = await getBodyData(request);

      if (!isValidUserData(bodyData)) {
        sendResponse(response, codesStatus.BadRequest, 'Invalid user data');
        return
      };

      const user = await User.updateUser(bodyData, id);
      sendResponse(response, codesStatus.OK, user);
    }

  } catch (error) {
    sendResponse(response, codesStatus.ServerError, 'Server error');
  }
}

/********************************************************
  * @desc
  * @route
  */
export async function deleteUser(request: IncomingMessage, response: ServerResponse, id: string) {
  try {
    const user = await User.findById(id);
    if (!user) {
      sendResponse(response, codesStatus.NotFound, 'User not found');
      return
    }

    User.deleteUser(id)
    sendResponse(response, codesStatus.NoContent, 'Deleted');
  } catch (error) {
    sendResponse(response, codesStatus.ServerError, 'Internal server error');
  }
}
