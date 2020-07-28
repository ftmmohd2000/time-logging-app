import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../entity/User";

const redirectPath = "/auth/google/redirect";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.URL}${redirectPath}`
    },
    async (_, __, profile, done) => {
      const user = await User.findOne({
        where: { email: profile._json.email }
      });
      if (user) {
        done(undefined, user);
      } else {
        const {
          given_name: firstName,
          family_name: lastName,
          email,
          email_verified: confirmed
        } = profile._json;

        const newUser = await User.create({
          firstName,
          lastName,
          email,
          confirmed
        }).save();

        done(undefined, newUser);
      }
    }
  )
);

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  done(null, await User.findOne({ where: { id } }));
});

export const googleAuthRouter = Router();

googleAuthRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleAuthRouter.get(
  redirectPath,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: "/"
  })
);
