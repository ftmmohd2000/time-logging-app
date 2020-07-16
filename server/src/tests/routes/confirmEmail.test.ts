import fetch from "node-fetch";

test("sends invalid back if bad id sent", async () => {
  const response = await fetch(`${process.env.TEST_HOST}/confirm/123467234`);
  expect(response.status).toBe(400);
});
