const express = require("express");
const router = express.Router();
const passport = require("./authenticate");
const membersControllers = require("../controllers/membersControllers");
const { validateUser, validatePost } = require("../controllers/validation");

router.get("/", membersControllers.membersBoardGet);
router.post("/", validatePost, membersControllers.messagePost);
router.get("/sign-up", membersControllers.signUpGet);
router.post("/sign-up", validateUser, membersControllers.signUpPost);
router.get("/sign-in", membersControllers.signInGet);
router.post(
    "/sign-in",
    passport.authenticate("local", {
        successRedirect: "/", // 登錄成功後跳轉
        failureRedirect: "/sign-in", // 登錄失敗後跳轉
        failureFlash: true, // 如果啟用 flash message，這裡可以顯示錯誤消息
    })
);
router.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

module.exports = router;
