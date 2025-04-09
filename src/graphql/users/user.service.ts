import prisma from "../../client/prisma";
import { Context } from "../../types/context";

export const UserService = {
  getUsers: async ({ req, res }: Context) => {
    const users = await prisma.user.findMany();
    if (!users) {
      return res.status(404).json({ message: { type: "error", text: "No users found" } });
    }
    return res.status(200).json({ users });
  },
  getUser: async ({ req, res }: Context) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ message: { type: "error", text: "User not found" } });
    }
    return res.status(200).json({ user });
  },
};
