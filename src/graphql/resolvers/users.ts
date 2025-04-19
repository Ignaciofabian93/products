import { UserService } from "../services/users";
import { type Context } from "../../types/context";

export const UserResolver = {
  Query: {
    users: (_parent: unknown, _args: unknown, context: Context) => UserService.getUsers(context),
    user: (_parent: unknown, _args: unknown, context: Context) => UserService.getUser(context),
    me: (_parent: unknown, _args: unknown, context: Context) => UserService.getMe(context),
  },
};
