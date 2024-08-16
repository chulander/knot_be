const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  addContact,
  modifyContact,
  removeContact,
  fetchContactHistory,
} = require('../controllers/contactController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, getAllContacts);
router.post('/', authenticateToken, addContact);
router.put('/:id', authenticateToken, modifyContact);
router.delete('/:id', authenticateToken, removeContact);
router.get('/:id/history', authenticateToken, fetchContactHistory);

module.exports = router;
