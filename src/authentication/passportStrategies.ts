import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user);
});

passport.deserializeUser((id: any, done) => {
  done(undefined, id)
});

/**
 * Sign in using Email and Password.
 */

passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
   done(undefined, {email, password})
}));


/**
 * Sign in with Facebook.
 */

passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: "/return",
    }, (accessToken, refreshToken, profile, cb) => {
      console.log('profile', profile)
      cb(null, profile);
    }
  )
);
