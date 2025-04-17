import { Context } from "../../types/context";
import { PasswordUpdate, User } from "../../types/user";
import { AuthService } from "../services/auth";

export const AuthResolver = {
  Mutation: {
    register: (_parent: any, _args: User) => AuthService.register(_args),
    updatePassword: (_parent: any, _args: PasswordUpdate, context: Context) =>
      AuthService.updatePassword(_args, context),
  },
};
