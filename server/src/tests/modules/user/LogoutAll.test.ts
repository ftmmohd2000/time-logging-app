import { Connection } from "typeorm";
import { User } from "../../../entity/User";
import { TestClient } from "../../../utils/TestClient";
import { IUser, createFakeUser } from "../../fixtures/users";
import { createTypeormConn } from "../../../utils/createTypeormConn";
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

test("should logout all clients", async () => {
  const { email, password } = user;

  const client1 = new TestClient(process.env.TEST_HOST as string);
  const client2 = new TestClient(process.env.TEST_HOST as string);

  await client1.login(email, password);
  await client2.login(email, password);

  const { data: response1 } = await client1.me();
  const { data: response2 } = await client2.me();
  expect(response1).toEqual({
    me: {
      ...user,
      name: `${user.firstName} ${user.lastName}`,
      password: undefined,
      id: userId
    }
  });
  expect(response1).toEqual(response2);

  await client1.logoutAll();

  const { data: response3 } = await client1.me();
  const { data: response4 } = await client2.me();
  expect(response3).toEqual({ me: null });
  expect(response3).toEqual(response4);
});
