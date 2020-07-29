import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { RegisterInputType } from "./register/RegisterInputType";

@Resolver(User)
class RegisterResolver {
  @Mutation(() => Boolean, { nullable: true })
  async register(
    @Arg("data")
    { firstName, lastName, email, password }: RegisterInputType
  ): Promise<boolean | null> {
    await User.create({
      firstName,
      lastName,
      email,
      password
    }).save();

    return true;
  }
}

export default RegisterResolver;
