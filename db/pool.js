require("dotenv").config();
const { Pool } = require("pg"); // 確保這裡使用的是 "pg" 模組

module.exports = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CA.replace(/\\n/g, "\n"),
    },
});
