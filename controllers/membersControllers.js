const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

async function membersBoardGet(req, res) {
    try {
        const board = await db.boardGet();
        res.render("board", {
            board: board,
            title: "Members' Board",
            isAuthenticated: req.isAuthenticated(),
        });
    } catch (error) {
        console.error("Error fetching board data:", error);
        res.status(500).send("Error fetching board data.");
    }
}

async function messagePost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const message = {
        title: req.body.title,
        content: req.body.content,
        memberId: req.user.id,
    };

    try {
        await db.messagePost(message);
        res.redirect("/");
    } catch (error) {
        console.error("Error posting message:", error);
        res.status(500).send("Error posting message.");
    }
}

async function signUpGet(req, res) {
    res.render("form", { title: "Sign Up" });
}

async function signUpPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const hashedPw = await bcrypt.hash(req.body.password, 12);
    const admin = req.body.admin === "bagel" ? true : false;
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPw,
        admin: admin,
    };
    await db.signUpPost(user);
    res.redirect("/");
}

async function signInGet(req, res) {
    res.render("form", { title: "Sign In" });
}

module.exports = {
    membersBoardGet,
    messagePost,
    signUpGet,
    signUpPost,
    signInGet,
};
