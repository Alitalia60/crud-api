import { TUser } from '../types/types';

const correctUser: TUser = {
  id: '',
  username: '',
  age: 0,
  hobbies: []

}

export function isValidUserData(usersData: Object): boolean {
  Object.keys(usersData).forEach(key => {
    if (!(key in correctUser)) {
      return false
    }
  });
  return true
}