import { Connection } from "typeorm";
import { createTypeormConn } from "../../utils/createTypeormConnection";
import { User } from "../../entity/User";
import { TestClient } from "../../utils/TestClient";
import { IUser, createFakeUser } from "../fixtures/users";

let conn: Connection;
let userId: string;
let user: IUser;

beforeAll(async () => {
  user = createFakeUser();
  conn = await createTypeormConn();
  userId = (await User.create({ ...user, confirmed: true }).save()).id;
});

afterAll(async () => {
  conn.close();
});

test("should logout user", async () => {
  const { email, password } = user;

  const client = new TestClient(process.env.TEST_HOST as string);

  await client.login(email, password);
  const { data: response1 } = await client.me();
  expect(response1).toEqual({ me: { email, id: userId } });

  const { data: response2 } = await client.logout();
  expect(response2).toEqual({ logout: true });

  const { data: response3 } = await client.me();
  expect(response3).toEqual({ me: null });
});

test("should not logout all users", async () => {
  const { email, password } = user;

  const client1 = new TestClient(process.env.TEST_HOST as string);
  const client2 = new TestClient(process.env.TEST_HOST as string);

  await client1.login(email, password);
  await client2.login(email, password);

  const { data: response1 } = await client1.me();
  const { data: response2 } = await client2.me();
  expect(response1).toEqual({ me: { email, id: userId } });
  expect(response1).toEqual(response2);

  await client1.logout();

  const { data: response3 } = await client1.me();
  const { data: response4 } = await client2.me();
  expect(response3).toEqual({ me: null });
  expect(response4).toEqual({ me: { email, id: userId } });
});
