import { Connection } from "typeorm";
import { User } from "../../../entity/User";
import { TestClient } from "../../../utils/TestClient";
import { createTypeormConn } from "../../../utils/createTypeormConn";
import { createFakeUser, IUser } from "../../fixtures/users";
import { USER } from "../../../constants";

let conn: Connection;
let user: IUser;
let userId: string;

beforeAll(async () => {
  conn = await createTypeormConn();
  user = createFakeUser(USER);
  userId = (await User.create({ ...user, confirmed: true }).save()).id;
});

afterAll(async () => {
  await conn.close();
});

test("shouldn't get user if not logged in", async () => {
  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response } = await client.me();
  expect(response).toEqual({ me: null });
});

test("get current user", async () => {
  const { email, password } = user;

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response1 } = await client.login(email, password);
  expect(response1).toEqual({ login: null });

  const { data: response2 } = await client.me();
  expect(response2).toEqual({
    me: {
      ...user,
      name: `${user.firstName} ${user.lastName}`,
      password: undefined,
      id: userId
    }
  });
});
