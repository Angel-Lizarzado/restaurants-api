const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restaurants'
});

db.on('error', (err) => {
    console.error('Error connecting to database:', err);
});

console.log('Connected to database');


module.exports = {
    execute: (query, params) => db.execute(query, params)
};