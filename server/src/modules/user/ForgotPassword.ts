import { Resolver, Query, Ctx, Arg } from "type-graphql";
import { MyContext } from "../../types/Context";
import { User } from "../../entity/User";
import { forgotPasswordPrefix } from "../../constants";
import { v4 as uuid } from "uuid";

@Resolver()
class ForgotPasswordResolver {
  @Query(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    const token = uuid();

    redis.set(`${forgotPasswordPrefix}${token}`, user.id, "ex", 60 * 60 * 24);

    // TODO email functionality here
    console.log(token);

    return true;
  }
}

export default ForgotPasswordResolver;
