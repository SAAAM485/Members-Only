const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./routes/authenticate");
const port = process.env.PORT || 3000;
const membersRouter = require("./routes/membersRouter");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "aVerySecureRandomString",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.errorMessages = req.flash("error");
    next();
});
app.use(express.static(path.join(__dirname, "public")));
app.use("/", membersRouter);

app.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}/`);
});
