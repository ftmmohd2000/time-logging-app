import { Resolver, GraphQLMiddlewareFunction } from "../types/graphql-utils";

export const useMiddleware = (
  middlewareFunc: GraphQLMiddlewareFunction,
  resolverFunc: Resolver
) => (parent: any, args: any, context: any, info: any) =>
  middlewareFunc(resolverFunc, parent, args, context, info);
