import { TUser } from '../types/types';

const correctUser: TUser = {
  id: '',
  username: '',
  age: 0,
  hobbies: []

}

export function validateUserData(usersData: string): string[] {

  const userDataAsObject = JSON.parse(usersData);
  const incorrectKeys: string[] = [];
  const missingKey: string[] = [];

  // validate if there are incorrect key(s)
  Object.keys(userDataAsObject).forEach(key => {
    if (!(key in correctUser)) {
      incorrectKeys.push(key)
    }
  });
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