import { TUser } from '../types/types';

const correctUser: TUser = {
  id: '',
  username: '',
  age: 0,
  hobbies: []

}

export function validateUserData(usersData: string): string[] {

  const userDataAsObject: TUser = JSON.parse(usersData);
  const incorrectKeys: string[] = [];
  const missingKey: string[] = [];

  // validate if there are incorrect key(s)
  Object.keys(userDataAsObject).forEach(key => {
    if (!(key in correctUser)) {
      incorrectKeys.push(key)
    }
  });

  if (!Array.isArray(userDataAsObject.hobbies)) {
    incorrectKeys.push('"hobby" must be an array')

  } else {
    if (userDataAsObject.hobbies.length > 0) {
      userDataAsObject.hobbies.forEach((item: string) => {
        if (typeof item !== 'string') {
          incorrectKeys.push('Array "hobby" must contain items of string')
        }
      });
    }
  }

  if (incorrectKeys.length > 0) {
    return incorrectKeys;
  }
  // validate if there are missing key(s)
  Object.keys(correctUser).forEach(key => {
    if (key !== 'id') {
      if (!(key in userDataAsObject)) {
        missingKey.push(key)
      }
    }
  });
  return missingKey;


}