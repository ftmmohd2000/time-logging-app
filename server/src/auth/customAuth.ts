import { AuthChecker, ResolverData } from "type-graphql";
import { MyContext } from "../types/Context";

export const customAuth: AuthChecker<MyContext, number> = ({
  context: { user }
}: ResolverData<MyContext>) => {
  if (!user) return false;
  return true;
};
