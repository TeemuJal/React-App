var express = require("express");
var cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require("./model/User.model")
const passport = require('passport');

var app = express();
app.use(cors());

mongoose.connect('mongodb://localhost/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./auth/auth');

app.use(bodyParser.urlencoded({ extended : false }));

const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure-routes');

// Standard routes
app.use('/', routes);

// Routes that need token authentication
app.use('/user', passport.authenticate('jwt', { session : false }), secureRoutes);

// app.post("/user/register", (req, res, next) => {
//     console.log(req.body);

//     const userEmail = req.body.email;
//     const plaintextPassword = req.body.password;

//     // Validate email and password on server-side as well
//     if (emailValidator.validate(userEmail) && schema.validate(plaintextPassword)) {
//         console.log("Valid email and password.");

//         // TODO check if user with the email exists

//         bcrypt.hash(plaintextPassword, saltRounds, async function(err, hash) {
//             console.log("password hashed: " + hash);

//             const user = new User({ email: userEmail, password: hash });

//             await user.save().then(function () {
//                 console.log("user created");
//             })
//             .catch(function (err) {
//                 console.log("Registration failed.")
//                 console.log(err)
//                 res.status(400).send("Registration failed.");
//             });
//         });
//         res.type("json").json("Registered successfully!");
//     }
//     else {
//         console.log("Invalid email/password.");

//         res.status(400).type("json").json("Invalid email/password.")
//     }
// });

// app.post("/user/login", (req, res, next) => {
//     console.log(req.body);

//     const userEmail = req.body.email;
//     const plaintextPassword = req.body.password;

//     // Find email in DB
//     User.findOne({ email: userEmail }, function(err, user) {
//         if (user) {
//             console.log("User exists");
//             // Check if password matches
//             bcrypt.compare(plaintextPassword, user.password, function(err, result) {
//                 if (result) {
//                     // Password matches
//                     console.log("Password matches");
//                     res.type("json").json("Logged in!");
//                 }
//                 else {
//                     console.log("Password doesn't match.");
//                     res.status(400).type("json").json("Wrong email/password");
//                 }
//             });
//         }
//         else {
//             console.log("User doesn't exist.");
//             res.status(400).type("json").json("Wrong email/password");
//         }
//     });
// });

//Handle errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error : err });
});

app.listen(9000, () => {
    console.log("Server running on port 9000");
});
