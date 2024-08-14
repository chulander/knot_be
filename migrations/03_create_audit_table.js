exports.up = function (knex) {
  return knex.schema.createTable('audit', (table) => {
    table.increments('id').primary(); // Auto-incrementing ID
    table.string('table_name').notNullable(); // Name of the table being audited
    table.string('field').notNullable(); // The specific field that was changed
    table.text('old_value').nullable(); // The previous value of the field
    table.text('new_value').nullable(); // The new value of the field
    table.timestamp('changed_at').defaultTo(knex.fn.now()); // Timestamp of the change
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('audit');
};
