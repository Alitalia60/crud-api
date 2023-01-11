import { init } from '../src/api/config/init';
import request from 'supertest';
import { beforeAll, describe, expect, test } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';


export const PORT = init().PORT;
const HOST = `http://localhost:${PORT}`;


// ****************************************************
describe('GET users', () => {

  //get all users
  test('an empty array is expected', async () => {
    await request(HOST)
      .get("/api/users/")
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .expect(200)
      .then(response => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
      });
  })
})

// ****************************************************
describe('POST Create and get user', () => {

  // !! test
  let newUserId = '';
  let newUser = {
    username: 'John Dow',
    age: 45,
    hobbies: ['First hobby', 'Bad hobby']
  }

  test('newly created user is expected', async () => {
    //add user
    await request(HOST)
      .post(`/api/users/`)
      .set("Accept", "application/JSON")
      .send(JSON.stringify(newUser))
      .expect("Content-Type", "application/JSON")
      .then(response => {
        newUserId = response.body.id;
        expect(response.status).toBe(201)
        // expect(response.body.length).toBe(0);
        expect(response.body.age).toEqual(45);
        expect(Array.isArray(response.body.hobbies)).toBe(true);
        expect(response.body.hobbies.length).toEqual(2);
      });
  })

  // !! test
  test('get created user', async () => {
    //get created user
    await request(HOST)
      .get(`/api/users/${newUserId}`)
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .expect(200)
      .then(response => {
        expect(response.body.username).toBe(newUser.username);
      })
  });


})

// ****************************************************
describe('PUT.  Try to update user', () => {
  // !! test
  let lastUserId: string = '';
  type TUser = {
    id?: string,
    username?: string,
    age?: number
  };
  let lastUser: TUser = {}
  test('testing update existing user ', async () => {

    await request(HOST)
      .get("/api/users/")
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .expect(200)
      .then(response => {
        lastUser = response.body[response.body.length - 1];
        if (lastUser.id) {
          lastUserId = lastUser.id;
        }
      });

    lastUser['username'] = 'NoName';
    lastUser['age'] = 35;

    await request(HOST)
      .put(`/api/users/${lastUserId}`)
      .set("Accept", "application/JSON")
      .send(JSON.stringify(lastUser))
      .expect("Content-Type", "application/JSON")
      .expect(200);

    await request(HOST)
      .get(`/api/users/${lastUserId}`)
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .expect(200)
      .then(response => {
        expect(response.body.username).toBe('NoName');
        expect(response.body.age).toEqual(35);
      });


  });

});

// ****************************************************
describe('POST.  Try to create user using incorrect data', () => {
  // !! test
  test('testing incorrect user data ', async () => {
    const incorrectKeyData = {
      name: 'New Test User',
      age: 25,
      hobbies: ['First hobby', 'Second hobby']
    }
    await request(HOST)
      .post(`/api/users/`)
      .set("Accept", "application/JSON")
      .send(JSON.stringify(incorrectKeyData))
      .expect("Content-Type", "application/JSON")
      .then(response => {
        // newUserId = response.body.id;
        expect(response.status).toBe(400)
      });

  });

  // !! test
  test('testing incorrect "hobby" data ', async () => {
    const incorrectHobbyData = {
      username: 'New Test User',
      age: 20,
      hobbies: 'First hobby'
    }
    await request(HOST)
      .post(`/api/users/`)
      .set("Accept", "application/JSON")
      .send(JSON.stringify(incorrectHobbyData))
      .expect("Content-Type", "application/JSON")
      .then(response => {
        // newUserId = response.body.id;
        expect(response.status).toBe(400)
      });

  });

  // !! test
  test('testing missing user data ', async () => {
    const missingKeyData = {
      age: 25,
      hobbies: ['First hobby', 'Second hobby']
    }
    await request(HOST)
      .post(`/api/users/`)
      .set("Accept", "application/JSON")
      .send(JSON.stringify(missingKeyData))
      .expect("Content-Type", "application/JSON")
      .then(response => {
        // newUserId = response.body.id;
        expect(response.status).toBe(400)
      });

    const missingHobbyData = {
      username: 'New Test User',
      age: 20,
    }
    await request(HOST)
      .post(`/api/users/`)
      .set("Accept", "application/JSON")
      .send(JSON.stringify(missingHobbyData))
      .expect("Content-Type", "application/JSON")
      .then(response => {
        // newUserId = response.body.id;
        expect(response.status).toBe(400)
      });

  });
})


// ****************************************************
describe('DELETE.  Try to delete user', () => {
  test('testing deleting existing user ', async () => {
    const res = await request(HOST)
      .get("/api/users/")
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .expect(200)

    const id = res.body[0].id;

    await request(HOST)
      .delete(`/api/users/${id}`)
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .then(response => {
        expect([200, 204].includes(response.status)).toEqual(true);
      })

    await request(HOST)
      .get(`/api/users/${id}`)
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .expect(404);

  });

});

// ****************************************************
describe('GET.  Try to get not existing or incorrect id', () => {

  // not found
  test('testing get not existing ID ', async () => {
    const id = uuidv4();
    await request(HOST)
      .get(`/api/users/${id}`)
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .expect(404)

  });
  // not uuid
  test('testing get not uuid ID ', async () => {
    const id = 'werw535e-gfhf-6456-65gh-gd8s5rctr542';
    await request(HOST)
      .get(`/api/users/${id}`)
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .then(response => {
        expect([400, 404].includes(response.status)).toEqual(true);
      })


  });
});
