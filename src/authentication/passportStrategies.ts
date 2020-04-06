import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import passportJwt from "passport-jwt";
import { configJwt } from "./config";
import { findUserById } from "../models/user";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const JwtStrategy = passportJwt.Strategy;

const localParams = {
  usernameField: "email",
  passwordField: "password"
};

const facebookParams = {
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK
};

const jwtParams = {
  secretOrKey: configJwt.jwtSecret,
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()
};

/**
 * Strategies
 */

const localStrategy = new LocalStrategy(
  localParams,
  (email, password, done) => {
    done(undefined, { email, password });
  }
);

const facebookStrategy = new FacebookStrategy(
  facebookParams,
  (accessToken, refreshToken, profile, done) => {
    console.log('Profile', profile)
    done(null, {profile,  accessToken});
  }
);

const jwtStrategy = new JwtStrategy(jwtParams, (jwtPayload, done) => {
  return findUserById(jwtPayload.id)
    .then(user => {
      return done(null, user);
    })
    .catch(err => {
      return done(new Error("User not found"), null);
    });
});

passport.serializeUser<any, any>((user, done) => {
  console.log(user);
  done(undefined, {user: user.profile, accessToken: user.accessToken});
});

passport.deserializeUser((id: any, done) => {
  done(undefined, id);
});



export const passportMethods = {
  init: () =>  passport.initialize(),
  initSession: () =>  passport.session(),
  initStrategies: () => {
    passport.use(localStrategy);
    passport.use(facebookStrategy);
    passport.use(jwtStrategy);
  }
}