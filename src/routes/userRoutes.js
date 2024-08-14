const express = require('express');
const { getAllUsers, signUp, login } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers); // This line might be where the error is happening
router.post('/signup', signUp);
router.post('/login', login);

module.exports = router;
