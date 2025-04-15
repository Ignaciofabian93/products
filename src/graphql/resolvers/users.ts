import { Request, Response } from "express";
import { UserService } from "../services/users";
import { Context } from "../../types/context";
import { User } from "../../types/user";

export const UserResolver = {
  Query: {
    users: (_parent: any, _args: any, context: Context) => UserService.getUsers(context),
    user: (_parent: any, _args: any, context: Context) => UserService.getUser(context),
    me: (_parent: any, _args: { token: string }, context: Context) => UserService.getMe(_args, context),
  },
  Mutation: {
    createUser: async (_parent: any, _args: User, context: Context) => await UserService.createUser(_args, context),
    updateUser: (_parent: any, _args: User, context: { req: Request; res: Response }) =>
      UserService.updateUser(_args, context),
    deleteUser: async (_parent: any, _args: { id: string }, context: Context) =>
      await UserService.deleteUser({ id: _args.id }, context),
  },
};
