const express = require('express');
const {
  getAllContacts,
  addContact,
  modifyContact,
  removeContact,
  fetchContactHistory,
} = require('../controllers/contactController');

const router = express.Router();

router.get('/:user_id', getAllContacts); // Get all contacts for a user
router.post('/:user_id', addContact); // Add a contact for a user
router.put('/:user_id/:id', modifyContact); // Update a contact for a user
router.delete('/:user_id/:id', removeContact); // Delete a contact for a user
router.get('/:user_id/:id/history', fetchContactHistory); // Get history of a contact for a user

module.exports = router;
