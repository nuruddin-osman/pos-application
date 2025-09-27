require("dotenv").config();
const passport = require("passport");
const User = require("../models/users/user.model");

const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETE_KEY;
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    try {
      const user = User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (error) {
      return done(error, false);
    }
  })
);
