const process = require('process');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const expiresIn = '1h';

const { getUsers, createUser, getUserByEmail } = require('../models/userModel');

const getAllUsers = async (req, res) => {
  console.log('getAllUsers');
  try {
    const users = await getUsers();
    console.log('users', users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser[0].id }, JWT_SECRET, {
      expiresIn,
    });
    res.status(201).json({ token, user: newUser[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = {
  getAllUsers,
  signUp,
  login,
};
