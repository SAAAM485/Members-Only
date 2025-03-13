const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/queries");
const bcrypt = require("bcryptjs");

// 定義 Local Strategy
passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                const result = await db.signInPost(username);

                if (!result.result) {
                    return done(null, false, { message: result.message }); // 驗證失敗
                }

                const user = result.user;
                const isMatch = await bcrypt.compare(password, user.password); // 密碼比對
                if (!isMatch) {
                    return done(null, false, {
                        message: "Invalid username or password",
                    });
                }

                return done(null, { username: user.username, id: user.id }); // 驗證成功
            } catch (err) {
                return done(err); // 發生錯誤
            }
        }
    )
);

// 序列化用戶
passport.serializeUser((user, done) => {
    // 將用戶的 username 和 id 存入 session
    done(null, { username: user.username, id: user.id });
});

// 反序列化用戶
passport.deserializeUser((user, done) => {
    // 直接將 session 中存儲的用戶對象返回給 req.user
    done(null, user);
});

module.exports = passport;
