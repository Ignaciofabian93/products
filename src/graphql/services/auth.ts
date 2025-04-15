import prisma from "../../client/prisma";
import jwt from "jsonwebtoken";
import { hash, genSalt } from "bcrypt";
import { Context } from "../../types/context";

type Register = {
  name: string;
  email: string;
  password: string;
  isCompany: boolean;
};

export const AuthService = {
  register: async ({ name, email, password, isCompany }: Register, { req, res }: Context) => {
    const checkIfExists = await prisma.user.findFirst({ where: { email } });

    if (checkIfExists) {
      throw new Error("El usuario ya se encuentra registrado");
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isCompany,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isCompany: user.isCompany,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "Usuario registrado correctamente",
    };
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
