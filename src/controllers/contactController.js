const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContactHistory,
} = require('../models/contactModel');

const getAllContacts = async (req, res) => {
  const { user_id } = req.params;
  try {
    const contacts = await getContacts(user_id);
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving contacts' });
  }
};

const addContact = async (req, res) => {
  const { user_id } = req.params;
  const contactData = { ...req.body, user_id };

  try {
    setTimeout(async () => {
      const newContact = await createContact(contactData);
      const io = req.app.get('socketio');
      io.emit('contact_created', newContact);
      res.status(201).json(newContact);
    }, 20000); // Simulate slow endpoint
  } catch (err) {
    res.status(500).json({ message: 'Error creating contact' });
  }
};

const modifyContact = async (req, res) => {
  const { id, user_id } = req.params;
  try {
    const updatedContact = await updateContact(id, req.body, user_id);
    const io = req.app.get('socketio');
    io.emit('contact_updated', updatedContact);
    res.status(200).json(updatedContact);
  } catch (err) {
    res.status(500).json({ message: 'Error updating contact' });
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
    res.status(500).json({ message: 'Error deleting contact' });
  }
};

const fetchContactHistory = async (req, res) => {
  const { id, user_id } = req.params;
  try {
    const history = await getContactHistory(id, user_id);
    res.status(200).json(history);
  } catch (err) {
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
