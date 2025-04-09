import prisma from "../../client/prisma";
import * as jwt from "jsonwebtoken";
import { hash, compare, genSalt } from "bcrypt";
import { Request, Response } from "express";

type Auth = {
  email: string;
  password: string;
};

type Context = {
  req: Request;
  res: Response;
};

export const AuthService = {
  login: async ({ email, password }: Auth, { req, res }: Context) => {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    const checkPassword = await compare(password, user.password);
    if (!checkPassword) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret");
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
      isCompany: user.isCompany,
    };
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 });
    return session;
  },
  register: async (name: string, email: string, password: string, isCompany: boolean) => {
    return await prisma.user.create({
      data: {
        name,
        email,
        password,
        isCompany,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },
  logout: async (id: string) => {
    return await prisma.session.delete({ where: { id } });
  },
  updatePassword: async (token: string, password: string, newPassword: string) => {
    const { id } = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };
    // const checkPassword = await compare(password, verifyToken);
    const salt = await genSalt(10);
    const hashedPassword = await hash(newPassword, salt);
    return await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },
};
