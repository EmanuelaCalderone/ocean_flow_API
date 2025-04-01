const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
<<<<<<< HEAD
    host: 'localhost',
    user: 'root',
    password: 'PassWord8!',
    database: 'ocean_flow_db'
=======
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
>>>>>>> main
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL!');
});

module.exports = connection;