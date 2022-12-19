import { User } from '../models/userModel';

export function isValidUserData(usersData: Object): boolean {
  Object.keys(usersData).forEach(key => {
    if (!(key in User)) {
      return false
    }
  });
  return true
}