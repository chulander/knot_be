const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('contacts').del();
  await knex('audit').del();

  // Insert new users
  const users = await knex('users')
    .insert([
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
    ])
    .returning('*');

  // Insert contacts and audit history for each user
  for (const user of users) {
    const contacts = await Promise.all(
      Array.from({ length: 5 }).map(async () => {
        const contact = {
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          email: faker.internet.email(),
          phone_number: faker.phone.number(),
          user_id: user.id,
        };

        const [newContact] = await knex('contacts')
          .insert(contact)
          .returning('*');

        // Insert audit history for the new contact
        const auditEntries = [
          {
            table_name: 'contacts',
            record_id: newContact.id,
            field: 'first_name',
            old_value: null,
            new_value: newContact.first_name,
            changed_at: knex.fn.now(),
          },
          {
            table_name: 'contacts',
            record_id: newContact.id,
            field: 'last_name',
            old_value: null,
            new_value: newContact.last_name,
            changed_at: knex.fn.now(),
          },
          {
            table_name: 'contacts',
            record_id: newContact.id,
            field: 'email',
            old_value: null,
            new_value: newContact.email,
            changed_at: knex.fn.now(),
          },
          {
            table_name: 'contacts',
            record_id: newContact.id,
            field: 'phone_number',
            old_value: null,
            new_value: newContact.phone_number,
            changed_at: knex.fn.now(),
          },
        ];

        await knex('audit').insert(auditEntries);

        return newContact;
      }),
    );

    // Further simulate some updates and audit history
    for (const contact of contacts) {
      const updatedEmail = faker.internet.email();
      await knex('contacts')
        .where({ id: contact.id })
        .update({ email: updatedEmail });

      await knex('audit').insert({
        table_name: 'contacts',
        record_id: contact.id,
        field: 'email',
        old_value: contact.email,
        new_value: updatedEmail,
        changed_at: knex.fn.now(),
      });
    }
  }
};
