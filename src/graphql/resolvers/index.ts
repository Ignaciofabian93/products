import { AuthResolver } from "./auth";
import { UserResolver } from "./users";

export const resolvers = {
  Query: {
    ...UserResolver.Query,
  },
  Mutation: {
    ...AuthResolver.Mutation,
    ...UserResolver.Mutation,
  },
};
