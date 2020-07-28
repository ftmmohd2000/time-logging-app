import { Router } from "express";
import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github";
import { User } from "../entity/User";

const redirectPath = "/auth/github/redirect";

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: `${process.env.URL}${redirectPath}`
    },
    async (_, __, profile, done) => {
      console.log(profile);
      const user = await User.findOne({
        where: { email: (profile._json as any).email }
      });
      if (user) {
        done(undefined, user);
      } else {
        const { name, email } = profile._json as any;

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

export const githubAuthRouter = Router();

githubAuthRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user"] })
);

githubAuthRouter.get(
  redirectPath,
  passport.authenticate("github", {
    scope: ["user"],
    successRedirect: "/"
  })
);
