var express = require("express");
var cors = require("cors");
var cookieParser = require('cookie-parser');
var emailValidator = require("email-validator");
var passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const mongoose = require('mongoose');

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = require("./src/User.model")

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

    const userEmail = req.body.email;
    const plaintextPassword = req.body.password;

    // Validate email and password on server-side as well
    if (emailValidator.validate(userEmail) && schema.validate(plaintextPassword)) {
        console.log("Valid email and password.");

        // TODO check if user with the email exists

        bcrypt.hash(plaintextPassword, saltRounds, async function(err, hash) {
            console.log("password hashed: " + hash);

            const user = new User({ email: userEmail, password: hash });

            await user.save().then(function () {
                console.log("user created");
            })
            .catch(function (err) {
                console.log("Registration failed.")
                console.log(err)
                res.status(400).send("Registration failed.");
            });
        });
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