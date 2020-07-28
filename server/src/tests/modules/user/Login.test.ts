import { Connection } from "typeorm";
import {
  invalidCredentials,
  emailNotConfirmed
} from "../../../modules/user/login/errorMessages";
import { createTypeormConn } from "../../../utils/createTypeormConn";
import { TestClient } from "../../../utils/TestClient";
import { createFakeUser } from "../../fixtures/users";
import { User } from "../../../entity/User";
import { USER } from "../../../constants";

let conn: Connection;

beforeAll(async () => {
  conn = await createTypeormConn();
});

afterAll(async () => {
  conn.close();
});

test("should not login unregistered user", async () => {
  const { email, password } = createFakeUser(USER);

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response } = await client.login(email, password);
  expect(response).toEqual({
    login: invalidCredentials
  });
});

test("should not login unconfirmed email", async () => {
  const user = createFakeUser(USER);
  const { email, password } = user;
  await User.create(user).save();

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response1 } = await client.login(email, password);
  expect(response1).toEqual({
    login: emailNotConfirmed
  });

  await User.update({ email }, { confirmed: true });

  const { data: response2 } = await client.login(email, password);
  expect(response2).toEqual({
    login: null
  });
});
