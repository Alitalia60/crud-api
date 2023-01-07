import request from 'supertest';
import assert from 'assert';
import express from 'express';

const app = express();

app.get('/api/users', function (req, res) {
  res.status(200).json({ name: 'john' });
});

request(app)
  .get('/api/users')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '15')
  .expect(200)
  .end(function (err, res) {
    if (err) throw err;
  });