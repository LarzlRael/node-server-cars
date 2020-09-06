const mysql = require('promise-mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'car_db'
});

const getConnection = () => connection;

module.exports = { getConnection }