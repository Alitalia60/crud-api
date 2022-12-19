import { isValidUserData } from 'api/validations/validateUser';
import { typeUser, users } from '../DataBase/users';
import { v4 as uuidv4 } from "uuid";

export class User {
  id: string;
  username: string;
  age: number;
  userData: string[];

  constructor(userData: typeUser) {
    this.id = uuidv4();
    this.username = userData['username'];
    this.age = userData['age'];
    this.userData = userData['hobbies'];
  }

  static async findAll() {
    return await new Promise((resolve, reject) => {
      resolve(users)
    })
  }

  static async findById(id: string) {
    return await new Promise((resolve, reject) => {
      const user = users.find(item => item.id === id);
      resolve(user)
    })
  }

  static async createUser(bodyData: string) {
    return await new Promise((resolve, reject) => {
      // if (isValidUserData(t)) {
      //   reject('Incorect user\'s data')
      // };
      const newUser = new User(JSON.parse(bodyData));
      users.push(newUser);
      resolve(newUser)
    })
  }

  static async updateUser(reqBody: typeUser, id: string) {
    //     return await new Promise((resolve, reject) => {
    //       if (isValidUserData(reqBody)) {
    //         reject('Incorect user\'s data')
    //       };
    //       const user = users.filter(item => item.id === id);
    //       {...user[0]} ={ ...reqBody };
    // resolve(user)
    //     })
  }
  static async deleteUser(id: string) {
    // await new Promise((resolve, reject) => {
    //   let newUsers = users.filter(item => item.id !== id);
    //   resolve(newUsers)
    // })
  }
}
