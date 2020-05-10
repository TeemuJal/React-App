const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../model/User.model');

var passwordValidator = require('password-validator');

// Schema for validating the password
var passwordSchema = new passwordValidator();
passwordSchema.is().min(8)
      .is().max(72)
      .has().digits()
      .has().not().spaces();

// Schema for validating the username
var usernameSchema = new passwordValidator();
usernameSchema.is().min(3)
      .is().max(32)
      .has("^[a-zA-Z0-9_]+$");

// Passport middleware for registration
passport.use('register', new localStrategy({
  usernameField : 'username',
  passwordField : 'password'
}, async (username, password, done) => {
    console.log("Register middleware");
    try {
      if (usernameSchema.validate(username)) {
        console.log("Valid username");
      }
      // Validate email and password on server-side as well
      if (usernameSchema.validate(username) && passwordSchema.validate(password)) {
        console.log("Valid username and password.");
        
        // Create user in DB
        const user = await User.create({ username, password });
        console.log("User created");
        return done(null, user);
      }
      else {
        done("Invalid username/password.");
      }
    } 
    catch (error) {
      console.log(error.errmsg);
      done("Something went wrong. Username could be taken.");
    }
}));

// Passport middleware for login
passport.use('login', new localStrategy({
  usernameField : 'username',
  passwordField : 'password'
}, async (username, password, done) => {
  console.log("Login middleware");
  try {
    // Dummy user used against timing attacks when the user doesn't exist
    const dummyUser = await User.findOne({ username: "aa"});

    let validate = undefined;
    let user = undefined;
    // Find real user if username provided isn't the dummy user's username (real username > 2 chrs)
    if (username !== "aa") {
      user = await User.findOne({ username });
    }
    if( !user ){
      console.log("User doesn't exist.");
      // Validate dummy user's password (always fails), should prevent timing attacks
      validate = await dummyUser.isValidPassword("sdffffffflksjdfii");
    }
    else {
      validate = await user.isValidPassword(password);
    }
    if( !validate ){
      console.log("Password doesn't match.");
      return done(null, false, { message : 'Wrong username/password!'});
    }
    console.log("Password matches");
    return done(null, user, { message : 'Logged in!'});
  } 
  catch (error) {
    return done(error);
  }
}));

// Verify token
passport.use(new JWTstrategy({
  secretOrKey : process.env.JWT_SECRET,
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    return done(null, token.user);
  } 
  catch (error) {
    done(error);
  }
}));
