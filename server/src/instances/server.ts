import connectRedis from "connect-redis";
import RateLimit from "express-rate-limit";
import session from "express-session";
import { GraphQLServer } from "graphql-yoga";
import RedisStore from "rate-limit-redis";
import { buildSchema } from "type-graphql";
import { redisSessionPrefix, userSessionPrefix } from "../constants";
import { User } from "../entity/User";
import { redis } from "./redis";
import resolvers from "../modules";
import { createTypeormConn } from "../utils/createTypeormConn";
import passport from "passport";
import { googleAuthRouter } from "../routers/googleAuth";
import { customAuth } from "../auth/customAuth";
import { githubAuthRouter } from "../routers/githubAuth";
import { twitterAuthRouter } from "../routers/twitterAuth";
import { facebookAuthRouter } from "../routers/facebookAuth";

export const startServer = async () => {
  // create schema using resolvers
  const schema = await buildSchema({
    resolvers: resolvers as any,
    authChecker: customAuth
  });

  // create server using schema
  const server = new GraphQLServer({
    schema: schema as any,
    context: async ({ request, response }) => {
      let user: User | undefined;

      if (request.session) {
        if (request.session.passport)
          // OAuth login
          user = await User.findOne({
            where: { id: request.session.passport.user }
          });
        // manual login
        else
          user = await User.findOne({
            where: { id: request.session!.userId }
          });
      }

      let sessionIDs: string[];
      if (user) {
        sessionIDs = await redis.lrange(
          `${userSessionPrefix}${user.id}`,
          0,
          -1
        );
      } else {
        sessionIDs = [];
      }

      return {
        redis,
        url: request.protocol + "://" + request.get("host"),
        req: request,
        res: response,
        user,
        sessionIDs
      };
    }
  });

  // rate limit server
  server.express.use(
    RateLimit({
      store: new RedisStore({
        client: redis
      }),
      windowMs: 15 * 60 * 100,
      max: 100
    })
  );

  const redisStore = connectRedis(session);

  // connect store to redis
  server.express.use(
    session({
      store: new redisStore({
        client: redis,
        prefix: redisSessionPrefix
      }),
      name: "qid",
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    })
  );

  server.express.use(passport.initialize());
  server.express.use(passport.session());

  server.express.use(googleAuthRouter);
  server.express.use(githubAuthRouter);
  server.express.use(twitterAuthRouter);

  // enable cors from frontend
  const cors = {
    credentials: true,
    origin: process.env.FRONTEND_HOST as string
  };

  // connect to database
  await createTypeormConn();

  const port = process.env.PORT;
  const app = await server.start({ port, cors });
  console.log(`Server is running on localhost:${port}`);

  return app;
};
