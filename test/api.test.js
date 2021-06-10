const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏'
      }, done);
  });
});

describe('GET /api/v1/places', () => {
  it('responds with 400 error', (done) => {
    request(app)
      .get('/api/v1/places')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});

describe('GET /api/v1/places', () => {
  it('responds with 400 error', (done) => {
    request(app)
      .get('/api/v1/places?lat=102&lon=93')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});

describe('GET /api/v1/places', () => {
  it('responds with 400 error', (done) => {
    request(app)
      .get('/api/v1/places?lat=92&lon=190')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});
