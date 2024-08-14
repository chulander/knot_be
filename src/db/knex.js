const process = require('process');
const environment = process.env.NODE_ENV || 'development';
console.log('Environment:', environment);
const config = require('../../knexfile')[environment];
console.log('Config:', config)
const knex = require('knex')(config);

module.exports = knex;
