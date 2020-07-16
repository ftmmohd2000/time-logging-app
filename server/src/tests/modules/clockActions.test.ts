import { Connection } from "typeorm";
import { TimePeriod } from "../../entity/TimePeriod";
import { User } from "../../entity/User";
import { notLoggedInError } from "../../modules/clockActions/errorMessages";
import { createTypeormConn } from "../../utils/createTypeormConnection";
import { TestClient } from "../../utils/TestClient";
import { createFakeUser, IUser } from "../fixtures/users";

let conn: Connection;
let testUser: IUser;

beforeAll(async () => {
  conn = await createTypeormConn();
});

beforeEach(async () => {
  testUser = createFakeUser();
});

afterAll(async () => {
  conn.close();
});

test("should clock in user", async () => {
  const client = new TestClient(process.env.TEST_HOST as string);
  const payRate = 10.15;

  // create User entity
  let user = User.create({ ...testUser, confirmed: true });

  // grab password before hashing
  const { email, password } = user;

  await user.save();

  // grab uuid
  const { id } = user;

  // login user
  await client.login(email, password);

  // clock in user
  const { data: response } = await client.clockIn(payRate);
  expect(response).toEqual({ clockIn: null });

  const tp = await TimePeriod.find({ where: { employeeId: id } });

  expect(tp.length).toBe(1);
  expect(tp[0].endTime).toBeNull();
  expect(tp[0].payRate).toBe(payRate + "");
  expect(tp[0].startTime).not.toBe("-1");

  // update user object with data from table
  user = (await User.findOne({ where: { id } })) as User;

  expect(user.clockedIn).toBe(true);
});

test("should clock out user", async () => {
  const client = new TestClient(process.env.TEST_HOST as string);
  const payRate = 10.15;

  // create User entity
  let user = User.create({ ...testUser, confirmed: true });

  // grab password before hashing
  const { email, password } = user;

  await user.save();

  // grab uuid
  const { id } = user;

  // login user
  await client.login(email, password);

  // clock in user
  await client.clockIn(payRate);

  // clock out user
  const { data: response } = await client.clockOut();
  expect(response).toEqual({ clockOut: null });

  // get all of this users' worked times
  const tp = await TimePeriod.find({ where: { employeeId: id } });

  expect(tp.length).toBe(1);
  expect(tp[0].endTime).not.toBeNull();
  expect(tp[0].payRate).toBe(payRate + "");
  expect(tp[0].startTime).not.toBe("-1");

  user = (await User.findOne({ where: { id } })) as User;

  expect(user.clockedIn).toBe(false);
});

test("should not clock in if not logged in", async () => {
  const client = new TestClient(process.env.TEST_HOST as string);
  const payRate = 10.15;

  // create User entity
  let user = User.create({ ...testUser, confirmed: true });

  await user.save();

  // grab uuid
  const { id } = user;

  // try clocking in without login
  const { data: response } = await client.clockIn(payRate);
  expect(response).toEqual({
    clockIn: [{ path: "email", message: notLoggedInError }]
  });

  const tp = await TimePeriod.find({ where: { employeeId: id } });

  expect(tp.length).toBe(0);

  user = (await User.findOne({ where: { id } })) as User;

  expect(user.clockedIn).toBe(false);
});
