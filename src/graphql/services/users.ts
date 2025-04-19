import prisma from "../../client/prisma";
import { type Context } from "../../types/context";
import { TokenValidation } from "../../middleware/tokenValidation";

export const UserService = {
  getUsers: async ({ token }: Context) => {
    const decodedToken = TokenValidation(token as string);
    if (!decodedToken) {
      throw new Error("Token no valido");
    }
    const users = await prisma.user.findMany();
    if (!users) {
      return { error: "No existen usuarios" };
    }
    return users;
  },
  getUser: async ({ req, token }: Context) => {
    const decodedToken = TokenValidation(token as string);
    if (!decodedToken) {
      throw new Error("Token no valido");
    }
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return { error: "Usuario no encontrado" };
    }
    return user;
  },
  getMe: async ({ token }: Context) => {
    const decodedToken = TokenValidation(token as string);
    if (decodedToken) {
      const id = decodedToken as string;
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        return { error: "Usuario no encontrado" };
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        isCompany: user.isCompany,
        createdAt: user.createdAt.toLocaleDateString(),
        updatedAt: user.updatedAt.toLocaleDateString(),
      };
    }
  },
};
