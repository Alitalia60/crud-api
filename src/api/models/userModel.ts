
import { v4 as uuidv4, validate } from 'uuid';

export type typeUser = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[]
}

export let users: typeUser[] = [
  {
    "id": "9db530b3-726c-487f-be5d-c80bef62bd58",
    "username": "Andrew",
    "age": 26,
    "hobbies": [
      "fishing",
      "hunting"
    ]
  },
  {
    "id": "3db54dec-51fc-4725-acbf-f6808aa93231",
    "username": "Jury",
    "age": 62,
    "hobbies": [
      "no"
    ]
  },
  {
    "id": "a688a856-7e62-4aa4-ab75-f7e07733b793",
    "username": "Mary",
    "age": 28,
    "hobbies": [
      "Dance",
      "Sings"
    ]
  }

];

export class User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];

  constructor(userData: typeUser) {
    this.id = uuidv4();
    this.username = userData['username'];
    this.age = userData['age'];
    this.hobbies = userData['hobbies'];
  }

  static async findAll(): Promise<typeUser[]> {
    return await new Promise((resolve, reject) => {
      resolve(users)
    })
  }

  static async findById(id: string): Promise<typeUser | undefined> {
    return await new Promise((resolve, reject) => {
      const user: typeUser | undefined = users.find(item => item.id === id);
      if (user) {
        resolve(user)
      } else {
        resolve(undefined)
      }
      reject()
    })
  }

  static async createUser(bodyData: string): Promise<typeUser> {
    return await new Promise((resolve, reject) => {
      const newUser = new User(JSON.parse(bodyData));
      users.push(newUser);
      resolve(newUser)
    })
  }

  static async updateUser(bodyData: string, id: string): Promise<typeUser> {
    return await new Promise((resolve, reject) => {
      const user: typeUser | undefined = users.find(item => item.id === id);
      if (user) {
        const index: number = users.indexOf(user);
        users[index] = { id, ...JSON.parse(bodyData) };
        resolve(users[index])
      }
    })
  }

  static async deleteUser(id: string): Promise<void> {
    await new Promise((resolve, reject) => {
      // const user = users.find(item => item.id === id);
      users = users.filter(item => item.id !== id);
      resolve({})
    })
  }
}
