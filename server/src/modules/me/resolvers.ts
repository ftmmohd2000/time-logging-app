import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { useMiddleware } from "../../utils/useMiddleware";
import middleware from "./middleware";

export const resolvers: ResolverMap = {
  Query: {
    me: useMiddleware(middleware, (_, __, { session }) =>
      User.findOne({ where: { id: session.userId } })
    )
  }
};
