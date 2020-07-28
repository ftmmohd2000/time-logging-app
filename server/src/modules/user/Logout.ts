import { Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { redisSessionPrefix, userSessionPrefix } from "../../constants";
import { MyContext } from "../../types/Context";

@Resolver()
class LogoutResolver {
  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve, reject) => {
      req.session!.destroy((err) => {
        if (err) {
          reject(false);
        }

        res.clearCookie("qid");

        resolve(true);
      });
    });
  }

  @Mutation(() => Boolean)
  @Authorized()
  async logoutAll(@Ctx() { res, redis, sessionIDs, user }: MyContext) {
    const unresolved: Promise<number>[] = [];

    for (const id of sessionIDs)
      unresolved.push(redis.del(`${redisSessionPrefix}${id}`));

    await Promise.all(unresolved);

    await redis.del(`${userSessionPrefix}${user!.id}`);

    res.clearCookie("qid");

    return true;
  }
}

export default LogoutResolver;
