import { Connection } from "typeorm";
import { User } from "../../entity/User";
import {
  duplicateEmail,
  invalidEmail,
  passwordNotLongEnough
} from "../../modules/register/errorMessages";
import { createTypeormConn } from "../../utils/createTypeormConnection";
import { TestClient } from "../../utils/TestClient";
import { createFakeUser, IUser } from "../fixtures/users";

let conn: Connection;
let testUser: IUser;

beforeAll(async () => {
  testUser = createFakeUser();
  conn = await createTypeormConn();
});

afterAll(() => {
  conn.close();
});

test("should register user with correct credentials", async () => {
  const { email, password } = testUser;

  const client = new TestClient(process.env.TEST_HOST as string);

  const response = await client.register(email, password);
  expect(response.data.register).toBeNull();

  const users = await User.find({ where: { email } });
  const user = users[0];
  expect(users).toHaveLength(1);
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});

test("shouldn't register user with incorrect email Id", async () => {
  const { password } = testUser;
  const email = "wrongEmailFormat";

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response } = await client.register(email, password);
  expect(response).toEqual({
    register: [{ path: "email", message: invalidEmail }]
  });
});

test("shouldn't register user with duplicate email Id", async () => {
  const { email, password } = testUser;

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response } = await client.register(email, password);
  expect(response).toEqual({
    register: [{ path: "email", message: duplicateEmail }]
  });
});

test("shouldn't register user with weak password", async () => {
  const { email } = testUser;
  const password = "aw";

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response } = await client.register(email, password);
  expect(response).toEqual({
    register: [{ path: "password", message: passwordNotLongEnough }]
  });
});
