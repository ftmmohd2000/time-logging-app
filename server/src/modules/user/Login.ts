import { compare } from "bcrypt";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { userSessionPrefix } from "../../constants";
import { User } from "../../entity/User";
import { MyContext } from "../../types/Context";
import { emailNotConfirmed, invalidCredentials } from "./login/errorMessages";

@Resolver(User)
class LoginResolver {
  @Mutation(() => String, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req, redis }: MyContext
  ): Promise<string | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return invalidCredentials;
    }

    if (!(await compare(password, user.password))) {
      return invalidCredentials;
    }

    if (!user.confirmed) {
      return emailNotConfirmed;
    }

    req.session!.userId = user.id;

    if (req.sessionID) {
      redis.lpush(`${userSessionPrefix}${user.id}`, req.sessionID);
    }

    return null;
  }
}

export default LoginResolver;
