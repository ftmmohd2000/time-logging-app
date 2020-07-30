import { Resolver, Mutation, Ctx, Arg, Authorized } from "type-graphql";
import { MyContext } from "../../types/Context";
import { Clock } from "../../entity/Clock";

@Resolver(Clock)
class MissedClockResolver {
  @Authorized()
  @Mutation(() => Boolean)
  async missedClockIn(
    @Ctx() { user }: MyContext,
    @Arg("time") time: number,
    @Arg("payRate") payRate: number
  ) {
    if (user!.clockedIn) return false;

    await Clock.create({
      start: time,
      end: undefined,
      forgot: true,
      payRate,
      userId: user!.id
    }).save();

    user!.clockedIn = true;

    await user!.save();

    return true;
  }
  @Authorized()
  @Mutation(() => Boolean)
  async missedClockOut(@Ctx() { user }: MyContext, @Arg("time") time: number) {
    if (!user!.clockedIn) return false;

    const clockPeriod = await Clock.findOne({
      where: { end: null, userId: user!.id }
    });

    if (clockPeriod!.forgot) return false;

    clockPeriod!.end = time;
    clockPeriod!.forgot = true;

    await clockPeriod!.save();

    user!.clockedIn = false;

    await user!.save();

    return true;
  }
}

export default MissedClockResolver;
