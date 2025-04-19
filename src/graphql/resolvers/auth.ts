import { type Context } from "../../types/context";
import { type PasswordUpdate, type User } from "../../types/user";
import { AuthService } from "../services/auth";

export const AuthResolver = {
  Mutation: {
    register: (_parent: unknown, _args: User) => AuthService.register(_args),
    updatePassword: (_parent: unknown, _args: PasswordUpdate, context: Context) =>
      AuthService.updatePassword(_args, context),
  },
};
