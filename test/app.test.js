
import request from 'supertest'

const HOST = 'http://localhost:4000';

describe('GET users', () => {
  test('an empty array is expected', async () => {
    const response = await request(HOST)
      .get("/api/users/")
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .expect(200);
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([]);

  })
})

describe.skip('POST /api/users', () => {
  test('newly created record is expected', async () => {

    const newUser = {
      usename: 'New Test User',
      age: 99,
      hobbies: ['First hobby', 'Second hobby']
    }

    const response = await request(HOST)
      .post(`/api/users/`)
      .set("Accept", "application/JSON")
      .send(newUser)
      .expect(res.status).toBe(201)
      .expect("Content-Type", "application/JSON")
      .then(res => {
        expect(response.body.id).toBe({ id, ...newUser })

      });

    await request(HOST)
      .get(`/api/users/${id}`)
      .set("Accept", "application/JSON")
      .expect("Content-Type", "application/JSON")
      .expect(200);
    // .then()

  })

})

