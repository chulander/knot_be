const knex = require('../db/knex');

const createContact = async (contact) => {
  const [newContact] = await knex('contacts').insert(contact).returning('*');

  await knex('contact_history').insert({
    contact_id: newContact.id,
    field: 'created',
    old_value: null,
    new_value: `${newContact.first_name} ${newContact.last_name} (${newContact.email})`,
  });

  return newContact;
};

const updateContact = async (id, updates) => {
  const contact = await knex('contacts').where({ id }).first();

  const changes = Object.keys(updates).map((field) => ({
    contact_id: id,
    field,
    old_value: contact[field],
    new_value: updates[field],
  }));

  await knex('contact_history').insert(changes);
  const [updatedContact] = await knex('contacts')
    .where({ id })
    .update(updates)
    .returning('*');

  return updatedContact;
};

const deleteContact = async (id) => {
  const contact = await knex('contacts').where({ id }).first();

  if (!contact) {
    return null;
  }

  await knex('contact_history').insert({
    contact_id: id,
    field: 'contact_deleted',
    old_value: `${contact.first_name} ${contact.last_name}`,
    new_value: null,
  });

  await knex('contacts').where({ id }).del();

  return contact;
};

// Fetch all contacts for a specific user
const getContacts = (userId) => {
  return knex('contacts').where({ user_id: userId }).select('*');
};

// Fetch history for a specific contact
const getContactHistory = (contactId) => {
  return knex('contact_history')
    .where({ contact_id: contactId })
    .orderBy('changed_at', 'desc');
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContactHistory,
};
