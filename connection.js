const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'BreezySnipez20!',
  database: 'employee',
});

module.exports = connection;