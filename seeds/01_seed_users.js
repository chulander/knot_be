const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Insert new users
  await knex('users').insert([
    {
      email: 'bryan.p.chu@gmail.com',
      password: await bcrypt.hash('Welcome1', 10),
      created_at: knex.fn.now(),
    },
    {
      email: 'kieran@knotapi.com',
      password: await bcrypt.hash('knotapi', 10),
      created_at: knex.fn.now(),
    },
  ]);
};
