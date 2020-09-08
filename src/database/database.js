const mysql = require('promise-mysql');
//? Variables de entorno
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const getConnection = () => connection;

module.exports = { getConnection }