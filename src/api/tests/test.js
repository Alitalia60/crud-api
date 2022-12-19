// import { IUser } from "../models/Users";
const users = [
  {
    id: '1',
    username: 'Andrew',
    age: 26,
    hobbies: ['fishing', 'hunting'],
  },
  {
    id: '2',
    username: 'Gleb',
    age: 31,
    hobbies: [],
  },
  {
    id: '3',
    username: 'Mary',
    age: 28,
    hobbies: ['Dance', 'Sings'],
  },
  {
    id: '4',
    username: 'Bob',
    age: 44,
    hobbies: ['Bicycle'],
  },
  {
    id: '5',
    username: 'Isak',
    age: 33,
    hobbies: ['horses'],
  },
  {
    id: '6',
    username: 'Nataly',
    age: 26,
    hobbies: ['yoga', 'fitness'],
  },
];

console.log(users.filter((item) => item.id === '2'));
