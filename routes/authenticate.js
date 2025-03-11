const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/queries");

// 定義 Local Strategy
passport.use(
    new LocalStrategy(
        {
            usernameField: "username", // 表單中的字段名
            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                const result = await db.signInPost(username, password);

                if (!result.result) {
                    return done(null, false, { message: result.message }); // 驗證失敗
                }

                const user = { username }; // 可以附加其他用戶信息
                return done(null, user); // 驗證成功
            } catch (err) {
                return done(err); // 發生錯誤
            }
        }
    )
);

// 序列化用戶
passport.serializeUser((user, done) => {
    done(null, user.username); // 將用戶名存儲在 session
});

// 反序列化用戶
passport.deserializeUser(async (username, done) => {
    try {
        const result = await db.memberBoardGet(username); // 根據 username 獲取用戶信息
        if (!result || result.length === 0) {
            return done(null, false);
        }
        done(null, { username: user.username, id: user.id }); // 恢復用戶到 req.user
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
