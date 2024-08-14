const process = require('process');
process.env.NODE_ENV = 'test';

const knex = require('./src/db/knex');

beforeAll(async () => {
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
});

afterEach(async () => {
  await knex.migrate.rollback();
});
