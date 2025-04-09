import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const AuthResolver = {
  Query: {
    login: (_parent: any, args: { email: string; password: string }, context: { req: Request; res: Response }) =>
      AuthService.login({ email: args.email, password: args.password }, { req: context.req, res: context.res }),
  },
  Mutation: {
    register: (_parent: any, args: { name: string; email: string; password: string; isCompany: boolean }) =>
      AuthService.register(args.name, args.email, args.password, args.isCompany),
    logout: (_parent: any, args: { id: string }) => AuthService.logout(args.id),
    updatePassword: (_parent: any, args: { token: string; password: string; newPassword: string }) =>
      AuthService.updatePassword(args.token, args.password, args.newPassword),
  },
};
