import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
import { createTypeormConn } from "../../utils/createTypeormConnection";
import { User } from "../../entity/User";
import * as Redis from "ioredis";
import fetch from "node-fetch";

let userId: string;
let redis: Redis.Redis;

beforeAll(async () => {
  await createTypeormConn();
  redis = new Redis();
  const user = await User.create({
    email: "bob5@bob.com",
    password: "asdfkgfbjkrmdcsxre"
  }).save();
  userId = user.id;
});

test("should generate valid link", async () => {
  const url = await createConfirmEmailLink(
    process.env.TEST_HOST as string,
    userId,
    redis
  );
  const response = await fetch(url);
  expect(response.status).toBe(200);
  const user = await User.findOne({ where: { id: userId } });
  expect((user as User).confirmed).toBeTruthy();
  const chunks = url.split("/");
  expect(await redis.get(chunks[chunks.length - 1])).toBeFalsy();
  const response2 = await fetch(url);
  expect(response2.status).toBe(400);
});
