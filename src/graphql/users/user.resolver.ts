import { UserService } from "./user.service";
import { Request, Response } from "express";

export const UserResolver = {
  Query: {
    users: async (_parent: any, _args: any, context: { req: Request; res: Response }) =>
      await UserService.getUsers({ req: context.req, res: context.res }),
    user: async (_parent: any, _args: any, context: { req: Request; res: Response }) =>
      await UserService.getUser({ req: context.req, res: context.res }),
  },
};
