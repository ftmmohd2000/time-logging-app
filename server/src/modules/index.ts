import { readdirSync } from "fs";
import { join } from "path";

const resolvers: any[] = [];

const folders = readdirSync(__dirname);

folders.forEach((folder) => {
  if (folder === "index.ts") return;

  const { default: resolverList }: any = require(join(__dirname, folder));
  resolvers.push(...resolverList);
});

export default resolvers;
