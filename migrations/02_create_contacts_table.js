exports.up = function (knex) {
  return knex.schema.createTable('contacts', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('email').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone_number').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique(['email', 'user_id']); // Unique constraint on email and user_id
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('contacts');
};
