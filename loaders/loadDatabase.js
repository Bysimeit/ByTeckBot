require('dotenv').config();
const mysql = require('mysql2');

module.exports = async () => {
    let db = await mysql.createConnection({
        host: process.env.database_host,
        user: process.env.database_user,
        password: process.env.database_password,
        database: process.env.database_name
    });

    return db;
};