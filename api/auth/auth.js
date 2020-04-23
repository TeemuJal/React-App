const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../model/User.model');

var emailValidator = require("email-validator");
var passwordValidator = require('password-validator');

// Password validator schema
var schema = new passwordValidator();
schema.is().min(8)
      .is().max(72)
      .has().digits()
      .has().not().spaces();

// Passport middleware for registration
passport.use('register', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
    console.log("Register middleware");
    try {
      // Validate email and password on server-side as well
      if (emailValidator.validate(email) && schema.validate(password)) {
        console.log("Valid email and password.");
        
        // Create user in DB
        const user = await User.create({ email, password });
        console.log("User created");
        return done(null, user);
      }
      else {
        done("Invalid email/password.");
      }
    } 
    catch (error) {
      done(error);
    }
}));

// Passport middleware for login
passport.use('login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
  console.log("Login middleware");
  try {
    const user = await User.findOne({ email });
    if( !user ){
      console.log("User doesn't exist.");
      return done(null, false, { message : 'Wrong email/password!'});
    }
    const validate = await user.isValidPassword(password);
    if( !validate ){
      console.log("Password doesn't match.");
      return done(null, false, { message : 'Wrong email/password!'});
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
  secretOrKey : 'top_secret',
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    return done(null, token.user);
  } 
  catch (error) {
    done(error);
  }
}));
