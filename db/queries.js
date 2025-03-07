const pool = require("./pool");
const bcrypt = require("bcryptjs");

async function memberBoardGet(username) {
    const rows = await pool.query(
        `
        SELECT messages.title, messages.timestamp, messages.content, members.username 
        FROM messages 
        JOIN members 
        ON messages.memberId = members.id 
        WHERE members.username = $1 
        ORDER BY messages.timestamp DESC`,
        [username]
    );
    return rows;
}

async function boardGet() {
    const rows = await pool.query(
        `
        SELECT messages.title, messages.timestamp, messages.content, members.username 
        FROM messages 
        JOIN members 
        ON messages.memberId = members.id 
        ORDER BY messages.timestamp DESC`
    );
    return rows;
}

async function signUpPost(firstName, lastName, username, password, admin) {
    await pool.query(
        `
        INSERT INTO members (firstName, lastName, username, password, admin) 
        VALUES ($1, $2, $3, $4, $5)`,
        [firstName, lastName, username, password, admin]
    );
}

async function signInPost(username, password) {
    try {
        const result = await pool.query(
            "SELECT * FROM members WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return { result: false, message: "User not found." };
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { result: false, message: "Wrong password." };
        }

        return { result: true, message: "Login successful." };
    } catch (err) {
        console.error("Error during sign-in process:", err);
        return { result: false, message: "An error occurred during sign-in." };
    }
}

async function messagePost(title, content, memberId) {
    await pool.query(
        `
        INSERT INTO messages (title, content, memberId) 
        VALUES ($1, $2, $3)`,
        [title, content, memberId]
    );
}
