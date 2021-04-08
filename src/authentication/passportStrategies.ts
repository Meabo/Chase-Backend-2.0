import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import passportJwt from "passport-jwt";
import passportCustom from "passport-custom";
import {
  generateAccessToken,
  verifyFacebookToken,
} from "../authentication/token";

import { configJwt } from "./config";
import { UserController } from "../controllers/UserController";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const JwtStrategy = passportJwt.Strategy;
const CustomStrategy = passportCustom.Strategy;

const localParams = {
  usernameField: "email",
  passwordField: "password",
};

const facebookParams = {
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
};

const jwtParams = {
  secretOrKey: configJwt.jwtSecret,
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
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
    console.log("Profile", profile);
    done(null, { profile, accessToken });
  }
);

const jwtStrategy = new JwtStrategy(jwtParams, (jwtPayload, done) => {
  const userController = new UserController();
  return userController
    .findUserById(jwtPayload.id)
    .then((user) => {
      return done(null, user);
    })
    .catch((err) => {
      return done(new Error("User not found"), null);
    });
});

const androidFacebookStrategy = new CustomStrategy(async (req, done) => {
  const facebookAccessToken = req.query.accessToken as string;
  if (!facebookAccessToken) done(new Error("Error with FacebookToken"), null);
  else {
    const response = await verifyFacebookToken(facebookAccessToken);
    const { data } = response;
    if (data && data.is_valid) {
      const userController = new UserController();
      userController
        .findUser("profile_facebook_id", data.user_id)
        .then(async (user: any) => {
          let user_ = user;
          if (!user) {
            user_ = await userController.createUserFacebook(
              data.user_id,
              facebookAccessToken
            );
          }
          console.log('User is', user_);
          const token = generateAccessToken(user_._id);
          console.log("Json Web token sent", token);
          done(null, token);
        })
        .catch((err) => done(err, null));
    } else {
      done(response.error.message, null);
    }
  }
});

passport.serializeUser((user: any, done) => {
  console.log(user);
  done(undefined, { user: user.profile, accessToken: user.accessToken });
});

passport.deserializeUser((id: any, done) => {
  done(undefined, id);
});

export const passportMethods = {
  init: () => passport.initialize(),
  initSession: () => passport.session(),
  initStrategies: () => {
    passport.use(localStrategy);
    passport.use(facebookStrategy);
    passport.use(jwtStrategy);
    passport.use("customAndroidFacebookStrategy", androidFacebookStrategy);
  },
};
