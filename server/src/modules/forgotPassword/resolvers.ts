import * as yup from "yup";
import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { formatYupError } from "../../utils/formatYupError";
import { passwordNotLongEnough } from "../register/errorMessages";
import { hash } from "bcrypt";

const schema = yup.object().shape({
  password: yup.string().min(7, passwordNotLongEnough).max(255)
});

export const resolvers: ResolverMap = {
  Mutation: {
    forgotPassword: async (
      _,
      { newPassword }: GQL.IForgotPasswordOnMutationArguments,
      { session }
    ) => {
      try {
        await schema.validate({ password: newPassword }, { abortEarly: false });
      } catch (e) {
        return formatYupError(e);
      }

      if (session.userId) {
        newPassword = await hash(newPassword, 12);
        await User.update({ id: session.userId }, { password: newPassword });
        return null;
      } else return [{ path: "session", message: "you are not logged in" }];
    }
  }
};
