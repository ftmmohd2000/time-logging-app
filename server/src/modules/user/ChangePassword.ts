import { Arg, Mutation, Resolver } from "type-graphql";
import { forgotPasswordPrefix } from "../../constants";
import { User } from "../../entity/User";
import { redis } from "../../instances/redis";
import { ChangePasswordInputType } from "./changePassword/ChangePasswordInputType";

@Resolver()
class ChangePasswordResolver {
  @Mutation(() => Boolean)
  async changePassword(
    @Arg("data") { password, token }: ChangePasswordInputType
  ) {
    const id = await redis.get(`${forgotPasswordPrefix}${token}`);

    if (!id) return false;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return false;
    }

    user.password = password;

    await user.save();

    redis.del(`${forgotPasswordPrefix}${token}`);

    return true;
  }
}

export default ChangePasswordResolver;
