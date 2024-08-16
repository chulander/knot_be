const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const authenticateToken = require('./middleware/auth');
const process = require('process');
require('dotenv').config();

const app = express();

// Configure CORS to allow requests from the frontend
const allowedOrigins = [process.env.FRONTEND_ORIGIN || 'http://localhost:5173']; // Add your frontend origin here
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow credentials to be sent (cookies, authorization headers, etc.)
  }),
);

// Middleware to parse JSON bodies and cookies
app.use(cookieParser());
app.use(express.json());

// Apply authentication middleware to all routes that require authentication
app.use('/api/contacts', authenticateToken, contactRoutes);
app.use('/api/users', userRoutes); // User routes don't need authentication initially

module.exports = app;
