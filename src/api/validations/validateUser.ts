import { validate } from 'uuid'
import { User } from '../models/userModel';

export function isVvalidId(uuid: string): boolean {
  return validate(uuid)
}

export function isValidUserData(usersData: Object): boolean {
  Object.keys(usersData).forEach(key => {
    if (!(key in User)) {
      return false
    }
  });
  return true
}