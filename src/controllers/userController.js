const process = require('process');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const expiresIn = '1h';

const { getUsers, createUser, getUserByEmail } = require('../models/userModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error retrieving users:', err);
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

    // Send JWT as httpOnly cookie
    res.cookie('token', token, {
      httpOnly: false, // Set to true in production, easier for testing in development if the cookie can be accessed by javascript
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 3600000, // 1 hour
    });

    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser[0] });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('email:', email);
  console.log('password:', password);

  try {
    const user = await getUserByEmail(email);
    console.log('user:', user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('isMatch:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn,
    });

    // Send JWT as httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = {
  getAllUsers,
  signUp,
  login,
};
