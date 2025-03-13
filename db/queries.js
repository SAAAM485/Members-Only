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
    return rows.rows;
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
    return rows.rows;
}

async function signUpPost(user) {
    await pool.query(
        `
        INSERT INTO members (firstName, lastName, username, password, admin) 
        VALUES ($1, $2, $3, $4, $5)`,
        [
            user.firstName,
            user.lastName,
            user.username,
            user.password,
            user.admin,
        ]
    );
}

async function signInPost(username) {
    try {
        const result = await pool.query(
            "SELECT * FROM members WHERE LOWER(username) = LOWER($1)",
            [username]
        );

        if (result.rows.length === 0) {
            return { result: false, message: "User not found." };
        }
        return { result: true, user: result.rows[0] };
    } catch (err) {
        console.error("Error during sign-in process:", err);
        throw err;
    }
}

async function messagePost(message) {
    await pool.query(
        `
        INSERT INTO messages (title, content, memberId) 
        VALUES ($1, $2, $3)`,
        [message.title, message.content, message.memberId]
    );
}

module.exports = {
    boardGet,
    signUpPost,
    signInPost,
    messagePost,
};
