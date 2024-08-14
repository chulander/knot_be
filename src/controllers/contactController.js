const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContactHistory,
} = require('../models/contactModel');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAllContacts = async (req, res) => {
  const { user_id } = req.params;
  try {
    const contacts = await getContacts(user_id);
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error retrieving contacts:', err);
    res.status(500).json({ message: 'Error retrieving contacts' });
  }
};

const addContact = async (req, res) => {
  const { user_id } = req.params;
  const contactData = { ...req.body, user_id };
  try {
    // Simulate slow endpoint by waiting for 20 seconds
    await delay(1000);
    const newContact = await createContact(contactData);
    const io = req.app.get('socketio');
    io.emit('contact_created', newContact);
    res.status(201).json(newContact);
  } catch (err) {
    console.error('bryan error', err);
    if (err.code === '23505') {
      // Check for the unique constraint violation error code
      console.error('Unique constraint violation:', err.detail);
      res.status(400).json({ message: `${req.body.email} already exists` });
    } else {
      console.error('Error creating contact:', err);
      res.status(500).json({ message: 'Error creating contact' });
    }
  }
};

const modifyContact = async (req, res) => {
  const { id, user_id } = req.params;
  try {
    console.log('req.body:', req.body);
    const { first_name, last_name, email, phone_number } = req.body;
    const updatedContact = await updateContact(id, user_id, {
      first_name,
      last_name,
      email,
      phone_number,
    });
    const io = req.app.get('socketio');
    io.emit('contact_updated', updatedContact);
    res.status(200).json(updatedContact);
  } catch (err) {
    if (err.code === '23505') {
      // Check for the unique constraint violation error code
      console.error('Unique constraint violation:', err.detail);
      res.status(400).json({ message: `${req.body.email} already exists` });
    } else {
      console.error('Error creating contact:', err);
      res.status(500).json({ message: 'Error creating contact' });
    }
  }
};

const removeContact = async (req, res) => {
  const { id, user_id } = req.params;
  try {
    const deletedContact = await deleteContact(id, user_id);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    const io = req.app.get('socketio');
    io.emit('contact_deleted', deletedContact);
    res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ message: 'Error deleting contact' });
  }
};

const fetchContactHistory = async (req, res) => {
  const { id, user_id } = req.params;
  try {
    const history = await getContactHistory(id, user_id);
    res.status(200).json(history);
  } catch (err) {
    console.error('Error retrieving contact history:', err);
    res.status(500).json({ message: 'Error retrieving contact history' });
  }
};

module.exports = {
  getAllContacts,
  addContact,
  modifyContact,
  removeContact,
  fetchContactHistory,
};
