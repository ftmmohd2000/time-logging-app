import { Ctx, Mutation, Resolver, Authorized, Arg } from "type-graphql";
import { Clock } from "../../entity/Clock";
import { MyContext } from "../../types/Context";
import moment from "moment";

@Resolver(Clock)
class ClockActionsResolver {
  @Authorized()
  @Mutation(() => Boolean)
  async clockIn(@Ctx() { user }: MyContext, @Arg("payRate") payRate: number) {
    if (user!.clockedIn) return false;

    user!.clockedIn = true;

    await user!.save();

    await Clock.create({
      userId: user!.id,
      start: moment().valueOf(),
      end: undefined,
      payRate
    }).save();

    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async clockOut(@Ctx() { user }: MyContext) {
    if (!user!.clockedIn) return false;

    const clockPeriod = await Clock.findOne({
      where: { userId: user!.id, end: null }
    });

    clockPeriod!.end = moment().valueOf();

    await clockPeriod!.save();

    user!.clockedIn = false;

    await user!.save();

    return true;
  }
}

export default ClockActionsResolver;
