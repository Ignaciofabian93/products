import prisma from "../../client/prisma";
import { hash, genSalt, compare } from "bcrypt";
import { type Context } from "../../types/context";
import { TokenValidation } from "../../middleware/tokenValidation";
import { type PasswordUpdate } from "../../types/user";

type Register = {
  name: string;
  email: string;
  password: string;
  isCompany: boolean;
};

export const AuthService = {
  register: async ({ name, email, password, isCompany }: Register) => {
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
  updatePassword: async ({ password, newPassword }: PasswordUpdate, { token }: Context) => {
    const decodedToken = TokenValidation(token as string);
    if (decodedToken) {
      const id = decodedToken as string;
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return new Error("El usuario no existe");
      }
      const checkPassword = await compare(password, user.password);
      if (!checkPassword) {
        throw new Error("La contraseña es incorrecta");
      }
      const salt = await genSalt(10);
      const hashedPassword = await hash(newPassword, salt);
      return await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });
    }
  },
};
