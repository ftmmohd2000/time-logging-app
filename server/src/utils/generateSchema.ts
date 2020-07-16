import { GraphQLSchema } from "graphql";
import { join } from "path";
import { readdirSync } from "fs";
import {
  loadSchemaSync,
  GraphQLFileLoader,
  addResolversToSchema,
  mergeSchemas
} from "graphql-tools";

export const genSchema = () => {
  const schemas: GraphQLSchema[] = [];
  const folders = readdirSync(join(__dirname, "../modules"));
  folders.forEach((folder) => {
    const { resolvers } = require(`../modules/${folder}/resolvers`);
    const typeDefs = loadSchemaSync(
      join(__dirname, `../modules/${folder}/schema.graphql`),
      { loaders: [new GraphQLFileLoader()] }
    );
    schemas.push(addResolversToSchema(typeDefs, resolvers));
  });

  return mergeSchemas({ schemas });
};
