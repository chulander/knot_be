exports.up = function (knex) {
  return knex.schema.createTable('contact_history', (table) => {
    table.increments('id').primary();
    table
      .integer('contact_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('contacts')
      .onDelete('CASCADE');
    table.string('field').notNullable();
    table.string('old_value');
    table.string('new_value');
    table.timestamp('changed_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('contact_history');
};
