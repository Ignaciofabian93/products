import { AuthService } from "./auth.service";
import { Context } from "../../types/context";

export const AuthResolver = {
  Mutation: {
    login: (_parent: any, args: { email: string; password: string }, context: Context) =>
      AuthService.login({ email: args.email, password: args.password }, { req: context.req, res: context.res }),

    register: (
      _parent: any,
      args: { name: string; email: string; password: string; isCompany: boolean },
      context: Context
    ) => {
      console.log(">> REGISTER SERVICE STARTED");
      console.log("DATA:: ", args.name, args.email, args.password, args.isCompany);
      return AuthService.register(
        { name: args.name, email: args.email, password: args.password, isCompany: args.isCompany },
        { req: context.req, res: context.res }
      );
    },

    logout: (_parent: any, args: { id: string }, context: Context) => AuthService.logout(args.id),

    updatePassword: (_parent: any, args: { token: string; password: string; newPassword: string }, context: Context) =>
      AuthService.updatePassword(args.token, args.password, args.newPassword),
  },
};
