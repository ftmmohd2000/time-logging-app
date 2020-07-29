import { Query, Resolver } from "type-graphql";
import { Clock } from "../../entity/Clock";

@Resolver(Clock)
class ClockActionsResolver {
  // @Mutation()
  // async clockIn(@Ctx() {user}:MyContext) {

  // }
  @Query(() => String)
  byeLol() {
    return "bye lmao";
  }
}

export default ClockActionsResolver;
