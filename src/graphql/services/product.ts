import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
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

    return products;
  },
  getFeedProducts: async ({
    limit = 10,
    scope = "MARKET",
    exchange,
  }: {
    limit?: number;
    scope: "MARKET" | "STORE";
    exchange: boolean;
  }) => {
    const isCompany = scope === "STORE";
    const products = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            isCompany: true,
            profileImage: true,
          },
        },
      },
      where: {
        isActive: true,
        isExchangeable: exchange,
        user: {
          isCompany,
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    if (!products) {
      return new ErrorService.NotFoundError("No se encontraron productos");
    }

    return products;
  },
  addProduct: async ({
    sku,
    barcode,
    color,
    brand,
    name,
    description,
    price,
    hasOffer,
    offerPrice,
    stock,
    isActive,
    isExchangeable,
    badges,
    images,
    userId,
    productCategoryId,
  }: Omit<Product, "id">) => {
    try {
      const product = await prisma.product.create({
        data: {
          sku: sku || null,
          barcode: barcode || null,
          color: color || null,
          brand,
          name,
          description,
          price,
          hasOffer,
          offerPrice,
          stock,
          isActive,
          isExchangeable,
          badges,
          images,
          userId,
          productCategoryId,
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
  updateProduct: async ({
    id,
    name,
    description,
    price,
    hasOffer,
    offerPrice,
    stock,
    images,
    productCategoryId,
    userId,
  }: Product) => {
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
        brand: "Brand Name", // Assuming a default brand name, adjust as necessary
      },
    });

    if (!product) {
      return new ErrorService.InternalServerError("Error al actualizar el producto");
    }

    return product;
  },
  deleteProduct: async ({ id }: { id: number }) => {
    const product = await prisma.product.delete({
      where: { id: Number(id) },
    });

    if (!product) {
      return new ErrorService.InternalServerError("Error al eliminar el producto");
    }

    return product;
  },
  stockControl: async ({ id, operation, quantity }: { id: number; quantity: number; operation: string }) => {
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
          stock: product.stock + quantity,
        },
      });

      return updatedProduct;
    } else if (operation === "subtract") {
      if (product.stock < quantity) {
        return new ErrorService.BadRequestError("No hay suficiente stock");
      }

      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          stock: product.stock - quantity,
        },
      });

      return updatedProduct;
    } else {
      return new ErrorService.BadRequestError("Operación no válida");
    }
  },
};
