import { generateNamespace } from "@gql2ts/from-schema";
import { writeFile } from "fs";
import { genSchema } from "../utils/generateSchema";
import { join } from "path";

writeFile(
  join(__dirname, "../types/schema.d.ts"),
  generateNamespace("GQL", genSchema()),
  (err) => console.log(err)
);
