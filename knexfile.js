const dotenv = require('dotenv-safe');
const process = require('process');
dotenv.config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:', // Use in-memory SQLite database
    },
    useNullAsDefault: true, // Required for SQLite
    migrations: {
      directory: './migrations',
   },
  },
};
