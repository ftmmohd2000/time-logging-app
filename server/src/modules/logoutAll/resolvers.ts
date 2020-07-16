import { redis } from "../../instances/redis";
import { ResolverMap } from "../../types/graphql-utils";
import { removeAllUserSessions } from "../../utils/removeAllUserSessions";

export const resolvers: ResolverMap = {
  Mutation: {
    logoutAll: async (_, __, { session }) => {
      const { userId } = session;
      if (userId) {
        removeAllUserSessions(userId, redis);
        return true;
      } else {
        return false;
      }
    }
  }
};
