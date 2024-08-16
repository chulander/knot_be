const express = require('express');
const { getAllUsers, signUp, login } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.post('/signup', signUp);
router.post('/login', login);

module.exports = router;
