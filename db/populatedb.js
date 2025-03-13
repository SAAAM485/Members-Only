require("dotenv").config();
const { Client } = require("pg");

const SQL_CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    username TEXT,
    password TEXT,
    admin BOOLEAN
);
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    title TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    content TEXT,
    memberId INTEGER REFERENCES members(id) ON DELETE CASCADE
);`;

async function main() {
    console.log("Seeding...");
    const client = new Client({
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
    await client.connect();
    await client.query(SQL_CREATE_TABLE);
    await client.end();
    console.log("Done");
}

main().catch((err) => console.error("Error executing script", err));
