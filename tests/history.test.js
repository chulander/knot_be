const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/db/knex');

describe('Contact History API', () => {
  let user;
  let contact;

  beforeAll(async () => {
    [user] = await knex('users')
      .insert({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
      })
      .returning('*');

    [contact] = await knex('contacts')
      .insert({
        user_id: user.id,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '1234567890',
      })
      .returning('*');
  });

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    await knex('contact_history').truncate();
  });

  it('should retrieve contact history', async () => {
    await request(app).put(`/api/contacts/${user.id}/${contact.id}`).send({
      first_name: 'Johnny',
    });

    const response = await request(app).get(
      `/api/contacts/${user.id}/${contact.id}/history`,
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].field).toBe('first_name');
    expect(response.body[0].old_value).toBe('John');
    expect(response.body[0].new_value).toBe('Johnny');
  });
});
