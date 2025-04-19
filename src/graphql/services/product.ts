import prisma from "../../client/prisma";
import { type Context } from "../../types/context";

export const ProductService = {
  getProducts: async () => {
    const products = await prisma.product.findMany();
  },
  getProduct: async ({ req }: Context) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });
  },
  addProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: async () => {},
  stockControl: async () => {},
};
