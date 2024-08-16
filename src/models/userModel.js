const knex = require('../db/knex');

const getUsers = () => {
  return knex('users').select('id', 'email'); // Should reference 'users'
};

const createUser = (user) => {
  return knex('users').insert(user).returning('*'); // Should reference 'users'
};

const getUserByEmail = (email) => {
  return knex('users').where({ email }).first(); // Should reference 'users'
};

module.exports = {
  getUsers,
  createUser,
  getUserByEmail,
};
