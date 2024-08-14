const knex = require('../db/knex');

const createContact = async (contact) => {
  try {
    const [newContact] = await knex('contacts').insert(contact).returning('*');

    // Prepare audit entries for each field in the contact
    const auditEntries = Object.keys(contact).map((field) => ({
      table_name: 'contacts',
      record_id: newContact.id, // Record the contact's ID
      field,
      old_value: null,
      new_value: newContact[field],
      changed_at: knex.fn.now(),
    }));

    // Insert the audit entries
    await knex('audit').insert(auditEntries);

    return newContact;
  } catch (err) {
    console.error('Error creating contact:', err);
    throw err; // Re-throw other errors
  }
};

const updateContact = async (id, userId, updates) => {
  if (typeof updates !== 'object' || updates === null) {
    throw new Error('Updates must be an object');
  }

  if ('id' in updates || 'user_id' in updates) {
    throw new Error('id and user_id fields cannot be updated');
  }

  try {
    const previousContact = await knex('contacts')
      .where({ id, user_id: userId })
      .first();

    if (!previousContact) {
      throw new Error('Contact not found');
    }

    const changedFields = [];
    const trackableFields = [
      'first_name',
      'last_name',
      'email',
      'phone_number',
    ];

    trackableFields.forEach((field) => {
      if (updates[field] && updates[field] !== previousContact[field]) {
        changedFields.push({
          table_name: 'contacts',
          record_id: id, // Record the contact's ID
          field,
          old_value: previousContact[field],
          new_value: updates[field],
          changed_at: knex.fn.now(),
        });
      }
    });

    const [updatedContact] = await knex('contacts')
      .where({ id, user_id: userId })
      .update(updates)
      .returning('*');

    if (changedFields.length > 0) {
      await knex('audit').insert(changedFields);
    }

    return updatedContact;
  } catch (err) {
    console.error('Error updating contact:', err);
    throw err;
  }
};

const deleteContact = async (id, userId) => {
  try {
    const contact = await knex('contacts')
      .where({ id, user_id: userId })
      .first();

    if (!contact) {
      throw new Error('Contact not found');
    }

    // Prepare audit entries for each field in the contact
    const auditEntries = Object.keys(contact).map((field) => ({
      table_name: 'contacts',
      record_id: id, // Record the contact's ID
      field,
      old_value: contact[field],
      new_value: null, // Deletion, so new value is null
      changed_at: knex.fn.now(),
    }));

    // Insert the audit entries
    await knex('audit').insert(auditEntries);

    // Delete the contact
    await knex('contacts').where({ id, user_id: userId }).del();

    return contact;
  } catch (err) {
    console.error('Error deleting contact:', err);
    throw err;
  }
};

// Fetch all contacts for a specific user
const getContacts = (userId) => {
  return knex('contacts').where({ user_id: userId }).select('*');
};

// Fetch history for a specific contact
const getContactHistory = async (contactId) => {
  return knex('audit')
    .where({
      table_name: 'contacts', // Filter by the specific table being audited
      record_id: contactId, // Filter by the specific record ID (e.g., contact_id)
    })
    .orderBy('changed_at', 'desc');
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContactHistory,
};
