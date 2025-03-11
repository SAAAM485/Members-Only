const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, query, validationResult } = require("express-validator");

const alphaErr = "must only contain letters";
const lengthErr = "must be between 1 and 10 characters";
const titleErr = "must be between 1 and 30 characters";
const contentErr = "Must be between 1 and 200 characters";

const validateUser = [
    body("firstName")
        .trim()
        .isAlpha()
        .withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 })
        .withMessage(`First name ${lengthErr}`),
    body("lastName")
        .trim()
        .isAlpha()
        .withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 })
        .withMessage(`Last name ${lengthErr}`),
    body("username")
        .trim()
        .isLength({ min: 1, max: 10 })
        .withMessage(`Username ${lengthErr}`),
    body("password")
        .trim()
        .isLength({ min: 1, max: 16 })
        .withMessage(`Password ${lengthErr}`),
    body("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
    body("title")
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage(`Username ${titleErr}`),
    body("content")
        .trim()
        .optional({ checkFalsy: true })
        .isLength({ min: 1, max: 200 })
        .withMessage(contentErr),
];

async function membersBoardGet(req, res) {
    const board = await db.boardGet();
    res.render("board", {
        board: board,
        title: "Members' Board",
        isAuthenticated: req.isAuthenticated(),
    });
}

async function messagePost(req, res) {
    if (!req.body.title || !req.body.content) {
        return res
            .status(400)
            .json({ message: "Title and content are required." });
    }

    const message = {
        title: req.body.title,
        content: req.body.content,
        memberId: req.user.id,
    };
    await db.messagePost(message);
    res.redirect("board");
}

async function signUpGet(req, res) {
    res.render("form", { title: "Sign Up" });
}

async function signUpPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const hashedPw = await bcrypt.hash(req.body.password, 10);
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPw,
        admin: req.body.admin,
    };
    await db.signUpPost(user);
    res.redirect("board");
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
