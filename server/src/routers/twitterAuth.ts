import { Router } from "express";
import passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { User } from "../entity/User";

const redirectPath = "/auth/twitter/redirect";

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID as string,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET as string,
      callbackURL: `${process.env.URL}${redirectPath}`,
      userProfileURL:
        "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
    },
    async (_, __, profile, done) => {
      const user = await User.findOne({
        where: { email: profile._json.email }
      });
      if (user) {
        done(undefined, user);
      } else {
        const { name, email } = profile._json;

        const newUser = await User.create({
          firstName: name.split(" ")[0],
          lastName: name.split(" ")[1],
          email,
          confirmed: true
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

export const twitterAuthRouter = Router();

twitterAuthRouter.get(
  "/auth/twitter",
  passport.authenticate("twitter", { scope: ["user"] })
);

twitterAuthRouter.get(
  redirectPath,
  passport.authenticate("twitter", {
    scope: ["user"],
    successRedirect: "/"
  })
);
