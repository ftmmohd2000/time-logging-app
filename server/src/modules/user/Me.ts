import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "../../types/Context";

@Resolver()
class MeResolver {
  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() { user }: MyContext): Promise<User | undefined> {
    return user;
  }
}

export default MeResolver;
