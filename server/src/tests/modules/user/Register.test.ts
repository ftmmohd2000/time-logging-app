import { Connection } from "typeorm";
import { User } from "../../../entity/User";
import { createTypeormConn } from "../../../utils/createTypeormConn";
import { TestClient } from "../../../utils/TestClient";
import { createFakeUser, IUser } from "../../fixtures/users";
import { USER } from "../../../constants";

let conn: Connection;
let testUser: IUser;
// let userId: string;

beforeAll(async () => {
  conn = await createTypeormConn();
  testUser = createFakeUser(USER);
  // userId = (await User.create({ ...testUser, confirmed: true }).save()).id;
});

afterAll(() => {
  conn.close();
});

test("should register user with correct credentials", async () => {
  const client = new TestClient(process.env.TEST_HOST as string);

  const response = await client.register({ ...testUser, role: "USER" });
  expect(response.data.register).toBeTruthy();

  const users = await User.find({ where: { email: testUser.email } });
  const user = users[0];
  expect(users).toHaveLength(1);
  expect(user.email).toEqual(testUser.email);
  expect(user.password).not.toEqual(testUser.password);
});

test("shouldn't register user with incorrect email Id", async () => {
  const email = "wrongEmailFormat";

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response } = await client.register({
    ...testUser,
    email,
    role: "USER"
  });
  expect(response).toEqual({
    register: null
  });
});

/*
test("shouldn't register user with duplicate email Id", async () => {
  const { email, password } = testUserA;

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response } = await client.register(email, password);
  expect(response).toEqual({
    register: [{ path: "email", message: duplicateEmail }]
  });
});

test("shouldn't register user with weak password", async () => {
  const { email } = testUserA;
  const password = "aw";

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response } = await client.register(email, password);
  expect(response).toEqual({
    register: [{ path: "password", message: passwordNotLongEnough }]
  });
});
*/
