import * as connectRedis from "connect-redis";
import * as RateLimit from "express-rate-limit";
import * as session from "express-session";
import { GraphQLServer } from "graphql-yoga";
import * as RedisStore from "rate-limit-redis";
import { redisSessionPrefix } from "../constants";
import { confirmEmail } from "../routes/confirmEmail";
import { createTypeormConn } from "../utils/createTypeormConnection";
import { genSchema } from "../utils/generateSchema";
import { redis } from "./redis";
import { TimePeriod } from "../entity/TimePeriod";

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: genSchema() as any,
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host"),
      session: request.session,
      req: request
    })
  });

  const store = new (connectRedis(session))({
    client: redis as any,
    prefix: redisSessionPrefix
  });

  server.express.use(
    RateLimit({
      store: new RedisStore({
        client: redis as any
      }),
      windowMs: 15 * 60 * 1000,
      max: 100
    })
  );

  server.express.use(
    session({
      store,
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
  const cors = {
    credentials: true,
    origin: process.env.FRONTEND_HOST as string
  };

  server.express.get("/confirm/:id", confirmEmail);

  await createTypeormConn();

  const port = process.env.PORT;
  const app = await server.start({ port, cors });
  console.log(`Server is running on localhost:${port}`);
  TimePeriod.create({});
  return app;
};
