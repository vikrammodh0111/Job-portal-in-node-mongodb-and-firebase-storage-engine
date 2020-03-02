const passport = require("passport");
const localPassport = require("passport-local").Strategy;
const User = require("../Models/Users");

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/* ********************************** Candidate Routes (1st User) ********************************** */
passport.use(
  "User-Register",
  new localPassport(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, { message: "Email is already in use" });
        }
        console.log(user);
        const newUser = new User({
          email: email,
          password: password,
          isCandidate: true
        });
        newUser.save((err, result) => {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        });
      });
    }
  )
);

passport.use(
  "users-login",
  new localPassport(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "No user found with this email"
          });
        }
        if (user.password != password) {
          return done(null, false, { message: "Invalid Password" });
        }
        return done(null, user);
      });
    }
  )
);

/* ********************************** Recruiter Routes (2nd User) ********************************** */

passport.use(
  "recriuter",
  new localPassport(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ email: email, isRecruiter: true }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, { message: "Email is Not Avaliable" });
        }
        const newRecruiter = new User({
          email: email,
          password: password,
          isCandidate: false,
          isRecruiter: true
        });
        newRecruiter.save((err, result) => {
          if (err) {
            return done(err);
          }
          return done(null, newRecruiter);
        });
      });
    }
  )
);
