const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({ 
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'intbotutn2023',
    database: process.env.DB_NAME || 'products_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado correctamente a la base de datos.');
        connection.release();
    }
});
module.exports = pool;