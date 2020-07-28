import { join } from "path";
import { readdirSync } from "fs";

const resolvers: any[] = [];

const files = readdirSync(__dirname);

files.forEach((file) => {
  if (!file.endsWith(".ts") || file === "index.ts") return;

  const { default: resolver }: any = require(join(__dirname, file));
  resolvers.push(resolver);
});

export default resolvers;
