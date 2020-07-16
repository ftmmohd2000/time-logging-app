import { ResolverMap } from "../../types/graphql-utils";

export const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { session }) => {
      const { userId } = session;
      return new Promise((res) => {
        if (userId) {
          session.destroy((err) => {
            if (err) console.log(err);
          });
          res(true);
        } else res(false);
      });
    }
  }
};
