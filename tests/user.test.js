const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/db/knex');

describe('User API', () => {
  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    await knex('users').truncate();
  });

  it('should create a new user', async () => {
    const response = await request(app).post('/api/users/signup').send({
      username: 'user1',
      email: 'user1@example.com',
      password: 'password',
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('user1@example.com');
  });

  it('should not allow creating a user with an existing email', async () => {
    await knex('users').insert({
      username: 'user1',
      email: 'user1@example.com',
      password: 'password',
    });

    const response = await request(app).post('/api/users/signup').send({
      username: 'user2',
      email: 'user1@example.com',
      password: 'password',
    });

    expect(response.status).toBe(400);
  });

  it('should authenticate a user with correct credentials', async () => {
    const [user] = await knex('users')
      .insert({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
      })
      .returning('*');

    const response = await request(app).post('/api/users/login').send({
      email: user.email,
      password: 'password',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should not authenticate a user with incorrect credentials', async () => {
    await knex('users').insert({
      username: 'user1',
      email: 'user1@example.com',
      password: 'password',
    });

    const response = await request(app).post('/api/users/login').send({
      email: 'user1@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(400);
  });
});
