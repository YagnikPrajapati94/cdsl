// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cdsl'
});

db.connect((err) => {
    if (err) {
        console.log("❌ Database Connection Failed:", err);
    } else {
        console.log("✅ Connected to MySQL 😊 (XAMPP)");
    }
});

// Export the connection
module.exports = { db };
