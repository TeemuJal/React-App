var express = require("express");
require('dotenv').config()
var cors = require("cors");
const bodyParser = require('body-parser');
// TODO check how secure MongoDB is for user management
const mongoose = require('mongoose');
const passport = require('passport');

var app = express();
// TODO check proper use of CORS if it's even needed
const corsOptions = {
  origin: 'http://localhost:3000', // allow development frontend
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

const User = require('./model/User.model');
createDummyUser();

require('./auth/auth');

app.use(bodyParser.urlencoded({ extended : false }));

const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure-routes');

// Standard routes
app.use('/', routes);

// Routes that need token authentication
app.use('/', passport.authenticate('jwt', { session : false }), secureRoutes);

//Handle errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error : err });
});

app.listen(9000, () => {
    console.log("Server running on port 9000");
});

// Creates a dummy user if it doesn't exist. 
// Dummy user is used in trying to prevent timing attacks by checking 
// the dummy user's password when the user doesn't exist.
function createDummyUser() {
  User.findOne({ username: "aa"}).then(user => user || User.create({username: "aa", password: "u1%7Cc"}));
}
