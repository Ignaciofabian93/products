import prisma from "../../client/prisma";
import { tokenVerify } from "../../middleware/auth";
import { Context } from "../../types/context";
import { User } from "../../types/user";

export const UserService = {
  getUsers: async ({ req, res }: Context) => {
    const users = await prisma.user.findMany();
    if (!users) {
      return { error: "No existen usuarios" };
    }
    return users;
  },
  getUser: async ({ req, res }: Context) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return { error: "Usuario no encontrado" };
    }
    return user;
  },
  getMe: async ({ token }: { token: string }, { req, res }: Context) => {
    const id = await tokenVerify(token);
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
  createUser: async ({ name, email, password, isCompany }: User, { req, res }: Context) => {
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
  updateUser: async ({ name, email, password, isCompany }: User, { req, res }: Context) => {
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
  deleteUser: async ({ id }: { id: string }, { req, res }: Context) => {
    const user = await prisma.user.delete({
      where: { id },
    });
    if (!user) {
    }
    return user;
  },
};
