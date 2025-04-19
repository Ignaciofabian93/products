import { ProductResolver } from "./products";

export const resolvers = {
  Query: {
    ...ProductResolver.Query,
  },
  Mutation: {
    ...ProductResolver.Mutation,
  },
};
