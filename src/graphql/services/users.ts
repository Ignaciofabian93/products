import prisma from "../../client/prisma";
import { Context } from "../../types/context";
import { User } from "../../types/user";
import { TokenValidation } from "../../middleware/tokenValidation";

export const UserService = {
  getUsers: async ({ token }: Context) => {
    const decodedToken = TokenValidation(token as string);

    const users = await prisma.user.findMany();
    if (!users) {
      return { error: "No existen usuarios" };
    }
    return users;
  },
  getUser: async ({ req, token }: Context) => {
    const decodedToken = TokenValidation(token as string);

    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return { error: "Usuario no encontrado" };
    }
    return user;
  },
  getMe: async ({ req, token }: Context) => {
    const decodedToken = TokenValidation(token as string);
    const { id } = req.params;
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
  },
  createUser: async ({ name, email, password, isCompany }: User, { token }: Context) => {
    const decodedToken = TokenValidation(token as string);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        isCompany,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    if (!user) {
    }
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      isCompany: user.isCompany,
      createdAt: user.createdAt.toLocaleDateString(),
      updatedAt: user.updatedAt.toLocaleDateString(),
    };
  },
  updateUser: async ({ name, email, password, isCompany }: User, { req, token }: Context) => {
    const decodedToken = TokenValidation(token as string);

    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
        isCompany,
        updatedAt: new Date(),
      },
    });
    if (!user) {
    }
    return user;
  },
  deleteUser: async ({ req, token }: Context) => {
    const decodedToken = TokenValidation(token as string);
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: { id },
    });
    if (!user) {
    }
    return user;
  },
};
