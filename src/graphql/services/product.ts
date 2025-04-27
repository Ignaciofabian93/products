import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { TokenValidation } from "../../middleware/tokenValidation";
import { type Context } from "../../types/context";
import { Product } from "../../types/product";

export const ProductService = {
  getProducts: async ({ token }: Context) => {
    const userId = TokenValidation(token as string) as string;
    if (!userId) {
      return new ErrorService.UnAuthorizedError("No autorizado");
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
        user: true,
      },
    });

    if (!products) {
      return new ErrorService.NotFoundError("No se encontraron productos");
    }

    return products;
  },
  getProduct: async ({ id }: { id: number }, { token }: Context) => {
    const userId = TokenValidation(token as string) as string;

    if (!userId) {
      return new ErrorService.UnAuthorizedError("No autorizado");
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        user: true,
      },
    });

    if (!product) {
      return new ErrorService.NotFoundError("Producto no encontrado");
    }

    return product;
  },
  addProduct: async (
    { name, description, price, hasOffer, offerPrice, stock, images, categoryId, userId }: Omit<Product, "id">,
    { token }: Context,
  ) => {
    const userIdToken = TokenValidation(token as string) as string;

    if (!userIdToken) {
      return new ErrorService.UnAuthorizedError("No autorizado");
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        hasOffer,
        offerPrice,
        stock,
        images,
        categoryId,
        userId,
      },
    });

    if (!product) {
      return new ErrorService.InternalServerError("Error al crear el producto");
    }

    return product;
  },
  updateProduct: async (
    { id, name, description, price, hasOffer, offerPrice, stock, images, categoryId, userId }: Product,
    { token }: Context,
  ) => {
    const userIdToken = TokenValidation(token as string) as string;

    if (!userIdToken) {
      return new ErrorService.UnAuthorizedError("No autorizado");
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price,
        hasOffer,
        offerPrice,
        stock,
        images,
        categoryId,
        userId,
      },
    });

    if (!product) {
      return new ErrorService.InternalServerError("Error al actualizar el producto");
    }

    return product;
  },
  deleteProduct: async ({ id }: { id: number }, { token }: Context) => {
    const userId = TokenValidation(token as string) as string;

    if (!userId) {
      return new ErrorService.UnAuthorizedError("No autorizado");
    }

    const product = await prisma.product.delete({
      where: { id: Number(id) },
    });

    if (!product) {
      return new ErrorService.InternalServerError("Error al eliminar el producto");
    }

    return product;
  },
  stockControl: async (
    { id, operation, amount }: { id: number; operation: string; amount: number },
    { token }: Context,
  ) => {
    const userId = TokenValidation(token as string) as string;

    if (!userId) {
      return new ErrorService.UnAuthorizedError("No autorizado");
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return new ErrorService.NotFoundError("Producto no encontrado");
    }

    if (operation === "add") {
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          stock: product.stock + amount,
        },
      });

      return updatedProduct;
    } else if (operation === "subtract") {
      if (product.stock < amount) {
        return new ErrorService.BadRequestError("No hay suficiente stock");
      }

      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          stock: product.stock - amount,
        },
      });

      return updatedProduct;
    } else {
      return new ErrorService.BadRequestError("Operación no válida");
    }
  },
};
