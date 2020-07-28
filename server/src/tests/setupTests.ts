import { startServer } from "../instances/server";
import { AddressInfo } from "net";
import "dotenv/config";

export default async () => {
  if (!process.env.TEST_HOST) {
    const app = await startServer();
    const { port } = app.address() as AddressInfo;
    process.env.TEST_HOST = `http://localhost:${port}`;
  }
};
