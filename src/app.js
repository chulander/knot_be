const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
