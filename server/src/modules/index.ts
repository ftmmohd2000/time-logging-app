import { readdirSync } from "fs";
import { join } from "path";

const resolvers: any[] = [];

const folders = readdirSync(__dirname);

folders.forEach((folder) => {
  if (folder === "index.ts") return;

  const files = readdirSync(join(__dirname, folder));

  files.forEach((file) => {
    if (!file.endsWith(".ts")) return;

    const { default: resolver }: any = require(join(__dirname, folder, file));

    resolvers.push(resolver);
  });
});

export default resolvers;
