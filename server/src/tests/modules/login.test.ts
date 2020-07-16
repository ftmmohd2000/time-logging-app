import { Connection } from "typeorm";
import { User } from "../../entity/User";
import {
  confirmEmailError,
  invalidLogin
} from "../../modules/login/errorMessages";
import { createTypeormConn } from "../../utils/createTypeormConnection";
import { TestClient } from "../../utils/TestClient";
import { IUser, createFakeUser } from "../fixtures/users";

let conn: Connection;
let testUser: IUser;

beforeAll(async () => {
  testUser = createFakeUser();
  conn = await createTypeormConn();
});

afterAll(async () => {
  conn.close();
});

test("should not login unregistered user", async () => {
  const { email, password } = testUser;

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response } = await client.login(email, password);
  expect(response).toEqual({
    login: [{ path: "email", message: invalidLogin }]
  });
});

test("should not login unconfirmed email", async () => {
  const { email, password } = testUser;

  await User.create({ email, password }).save();

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response1 } = await client.login(email, password);
  expect(response1).toEqual({
    login: [{ path: "email", message: confirmEmailError }]
  });

  await User.update({ email }, { confirmed: true });

  const { data: response2 } = await client.login(email, password);
  expect(response2).toEqual({
    login: null
  });
});
