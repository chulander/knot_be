const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/db/knex');

describe('Contacts API', () => {
  let user;

  beforeAll(async () => {
    // Create a test user
    [user] = await knex('users')
      .insert({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
      })
      .returning('*');
  });

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    await knex('contacts').truncate();
    await knex('contact_history').truncate();
  });

  it('should create a new contact for a user', async () => {
    const response = await request(app).post(`/api/contacts/${user.id}`).send({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '1234567890',
    });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('john.doe@example.com');
  });

  it('should not allow creating a contact with a duplicate email for the same user', async () => {
    await request(app).post(`/api/contacts/${user.id}`).send({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '1234567890',
    });

    const response = await request(app).post(`/api/contacts/${user.id}`).send({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '0987654321',
    });

    expect(response.status).toBe(400);
  });

  it('should allow creating a contact with the same email for different users', async () => {
    const user2 = await knex('users')
      .insert({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password',
      })
      .returning('*');

    await request(app).post(`/api/contacts/${user.id}`).send({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '1234567890',
    });

    const response = await request(app)
      .post(`/api/contacts/${user2[0].id}`)
      .send({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '0987654321',
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('john.doe@example.com');
  });

  it('should update a contact and reflect changes in contact history', async () => {
    const [contact] = await knex('contacts')
      .insert({
        user_id: user.id,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '1234567890',
      })
      .returning('*');

    const response = await request(app)
      .put(`/api/contacts/${user.id}/${contact.id}`)
      .send({
        first_name: 'Johnny',
        last_name: 'Doe',
      });

    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe('Johnny');

    const history = await knex('contact_history').where({
      contact_id: contact.id,
    });
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].field).toBe('first_name');
    expect(history[0].old_value).toBe('John');
    expect(history[0].new_value).toBe('Johnny');
  });

  it('should delete a contact and record it in contact history', async () => {
    const [contact] = await knex('contacts')
      .insert({
        user_id: user.id,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '1234567890',
      })
      .returning('*');

    const response = await request(app).delete(
      `/api/contacts/${user.id}/${contact.id}`,
    );

    expect(response.status).toBe(200);

    const history = await knex('contact_history').where({
      contact_id: contact.id,
    });
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].field).toBe('contact_deleted');
    expect(history[0].old_value).toBe('John Doe');
  });
});
