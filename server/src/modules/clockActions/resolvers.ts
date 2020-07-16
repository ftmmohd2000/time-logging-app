import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import {
  clockedInError,
  notLoggedInError,
  notClockedInError
} from "./errorMessages";
import { confirmEmailError } from "../login/errorMessages";
import { TimePeriod } from "../../entity/TimePeriod";
import * as moment from "moment";

export const resolvers: ResolverMap = {
  Mutation: {
    clockIn: async (
      _,
      { payRate }: GQL.IClockInOnMutationArguments,
      { session }
    ) => {
      if (session.userId) {
        const user = (await User.findOne({
          where: { id: session.userId }
        })) as User;
        if (user.clockedIn)
          return [{ path: "clockedIn", message: clockedInError }];
        if (!user.confirmed)
          return [{ path: "email", message: confirmEmailError }];

        user.clockedIn = true;
        await user.save();

        await TimePeriod.create({
          startTime: moment().valueOf(),
          payRate,
          employeeId: session.userId
        }).save();

        return null;
      } else {
        return [{ path: "email", message: notLoggedInError }];
      }
    },
    clockOut: async (_, __, { session }) => {
      if (session.userId) {
        const user = (await User.findOne({
          where: { id: session.userId }
        })) as User;
        if (!user.clockedIn)
          return [{ path: "clockedIn", message: notClockedInError }];

        user.clockedIn = false;
        await user.save();

        const currentTimePeriod = (await TimePeriod.findOne({
          where: { employeeId: session.userId, endTime: null }
        })) as TimePeriod;

        currentTimePeriod.endTime = moment().valueOf();

        await currentTimePeriod.save();

        return null;
      } else {
        return [{ path: "email", message: notLoggedInError }];
      }
    }
  }
};
