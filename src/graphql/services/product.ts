import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { TokenValidation } from "../../middleware/tokenValidation";
import { type Context } from "../../types/context";
import { Product } from "../../types/product";

export const ProductService = {
  getProducts: async () => {
    const products = await prisma.product.findMany({});

    if (!products) {
      return new ErrorService.NotFoundError("No se encontraron productos");
    }

    return products;
  },
  getProduct: async ({ id }: { id: number }) => {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return new ErrorService.NotFoundError("Producto no encontrado");
    }

    return product;
  },
  getProductsByOwner: async ({ id }: { id: string }) => {
    const products = await prisma.product.findMany({
      where: { userId: id },
    });

    if (!products) {
      return new ErrorService.NotFoundError("No se encontraron productos");
    }
    console.log("PROD:; ", products);

    return products;
  },
  addProduct: async ({
    name,
    description,
    price,
    hasOffer,
    offerPrice,
    stock,
    images,
    userId,
    productCategoryId,
    size,
  }: Omit<Product, "id">) => {
    try {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          hasOffer,
          offerPrice,
          stock,
          images,
          userId,
          productCategoryId,
          size: size || "regular",
        },
      });
      if (!product) {
        return new ErrorService.InternalServerError("Error al crear el producto");
      }

      return product;
    } catch (error) {
      console.log("ERROR!!:: ", error);
    }
  },
  updateProduct: async (
    { id, name, description, price, hasOffer, offerPrice, stock, images, productCategoryId, size, userId }: Product,
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
        userId,
        productCategoryId,
        size,
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
