import { Connection } from "typeorm";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConnection";
import { TestClient } from "../../utils/TestClient";
import { IUser, createFakeUser } from "../fixtures/users";

let conn: Connection;
let userId: string;
let testUser: IUser;

beforeAll(async () => {
  testUser = createFakeUser();
  conn = await createTypeormConn();
  userId = (await User.create({ ...testUser, confirmed: true }).save()).id;
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
  const { email, password } = testUser;

  const client = new TestClient(process.env.TEST_HOST as string);

  const { data: response1 } = await client.login(email, password);
  expect(response1).toEqual({ login: null });

  const { data: response2 } = await client.me();
  expect(response2).toEqual({ me: { email, id: userId } });
});
