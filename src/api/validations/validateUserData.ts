import { TUser } from '../types/types';

const correctUser: TUser = {
  id: '',
  username: '',
  age: 0,
  hobbies: []

};

export function validateUserData(usersData: string): string[] {

  const userDataAsObject: TUser = JSON.parse(usersData);
  const incorrectKeys: string[] = [];
  const missingKeys: string[] = [];
  const requiredKeys: string[] = [];

  // validate if there are incorrect key(s)
  Object.keys(userDataAsObject).forEach(key => {
    if (!(key in correctUser)) {
      incorrectKeys.push(key);
    }
  });

  // validate if "hobbies" are arrayof string
  if (!Array.isArray(userDataAsObject.hobbies)) {
    incorrectKeys.push('"hobby" must be an array');

  } else {
    if (userDataAsObject.hobbies.length) {
      userDataAsObject.hobbies.forEach((item: string) => {
        if (typeof item !== 'string') {
          incorrectKeys.push('Array "hobby" must contain items of string');
        }
      });
    }
  }

  if (incorrectKeys.length) {
    return incorrectKeys;
  }

  // validate if there are missing key(s)
  Object.keys(correctUser).forEach(key => {
    if (key !== 'id') {
      if (!(key in userDataAsObject)) {
        missingKeys.push(key);
      }
    }
  });
  if (missingKeys.length) {
    return missingKeys;
  }

  if (typeof userDataAsObject.age !== 'number') requiredKeys.push('age isn`t a number');
  if (typeof userDataAsObject.username !== 'string') requiredKeys.push('username isn`t a string');
  if (!userDataAsObject.username) requiredKeys.push('username is empty');
  return requiredKeys;

}