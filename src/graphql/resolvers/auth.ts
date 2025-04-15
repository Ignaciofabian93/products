import { Context } from "../../types/context";
import { AuthService } from "../services/auth";

export const AuthResolver = {
  Mutation: {
    register: (
      _parent: any,
      _args: { name: string; email: string; password: string; isCompany: boolean },
      context: Context
    ) =>
      AuthService.register(
        { name: _args.name, email: _args.email, password: _args.password, isCompany: _args.isCompany },
        context
      ),
    updatePassword: (_parent: any, _args: { token: string; password: string; newPassword: string }, context: Context) =>
      AuthService.updatePassword(_args.token, _args.password, _args.newPassword),
  },
};
