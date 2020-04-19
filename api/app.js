var express = require("express");
var cors = require("cors");
var cookieParser = require('cookie-parser');
var emailValidator = require("email-validator");
var passwordValidator = require('password-validator');

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Password validator schema
var schema = new passwordValidator();

schema
.is().min(8)
.is().max(72)
.has().digits()
.has().not().spaces();

app.get("/", (req, res, next) => {
    res.send("Hello world!");
});

app.post("/user/register", (req, res, next) => {
    console.log(req.body);

    const email = req.body.email;
    const plaintextPassword = req.body.password;

    // Validate email and password on server-side as well
    if (emailValidator.validate(email) && schema.validate(plaintextPassword)) {
        console.log("Valid email and password.");

        // TODO hash and salt password using Bcrypt
        // TODO create user in DB

        res.type("json");
        res.json("Registered successfully!");
    }
    else {
        console.log("Invalid email/password.");

        res.status(400);
        res.json("Invalid email/password.")
    }
});

app.listen(9000, () => {
    console.log("Server running on port 9000");
});