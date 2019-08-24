const mysql = require('mysql2');

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    database : 'txlist',
    password : 'nithin1!'
})

module.exports = pool.promise();