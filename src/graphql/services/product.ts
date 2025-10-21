import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { Context } from "../../types/context";
import { type PaginationProps } from "../../types/general";
import { type Product } from "../../types/product";
import { AddProductInput, FeedProductsArgs, PaginationArgs, UpdateProductInput } from "../resolvers/product";
import { userSelect, productCategorySelect, commentSelect, likeSelect } from "./selects/products";

export const ProductService = {
  getProducts: async ({ take = 20, skip = 0, orderBy }: PaginationArgs) => {
    try {
      const { field = "name", direction = "asc" } = orderBy || {};
      const orderByClause = { [field]: direction };
      const products: Product[] = await prisma.product.findMany({
        orderBy: orderByClause,
        take,
        skip,
      });

      if (!products) {
        return new ErrorService.NotFoundError("No se encontraron productos");
      }

      return products;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      return new ErrorService.InternalServerError("Error al obtener los productos");
    }
  },
  getProduct: async ({ id }: { id: number }) => {
    try {
      const product: Product | null = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        return new ErrorService.NotFoundError("Producto no encontrado");
      }

      return product;
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      return new ErrorService.InternalServerError("Error al obtener el producto");
    }
  },
  getProductsByOwner: async ({ sellerId, take = 20, skip = 0, orderBy }: PaginationArgs & { sellerId: string }) => {
    try {
      const { field = "name", direction = "asc" } = orderBy || {};
      const orderByClause = { [field]: direction };
      const products: Product[] = await prisma.product.findMany({
        orderBy: orderByClause,
        take,
        skip,
        where: { sellerId },
      });

      if (!products) {
        return new ErrorService.NotFoundError("No se encontraron productos");
      }

      return products;
    } catch (error) {
      console.error("Error al obtener los productos del propietario:", error);
      return new ErrorService.InternalServerError("Error al obtener los productos del propietario");
    }
  },
  getFeedProducts: async ({
    take = 20,
    scope = "MARKET",
    isExchangeable,
    sellerId,
    orderBy,
  }: FeedProductsArgs & Context) => {
    try {
      const { field = "createdAt", direction = "desc" } = orderBy || {};
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          isExchangeable,
        },
        take,
        orderBy: { [field]: direction },
      });

      if (!products) {
        return new ErrorService.NotFoundError("No se encontraron productos");
      }

      return products;
    } catch (error) {
      console.error("Error al obtener los productos del feed:", error);
      return new ErrorService.InternalServerError("Error al obtener los productos del feed");
    }
  },
  getMyFavorites: async ({ userId }: { userId: string | undefined }) => {
    try {
      const products: Product[] = await prisma.product.findMany({
        select: {
          id: true,
          sku: true,
          barcode: true,
          color: true,
          brand: true,
          name: true,
          description: true,
          price: true,
          images: true,
          hasOffer: true,
          offerPrice: true,
          stock: true,
          isExchangeable: true,
          ratingCount: true,
          reviewsNumber: true,
          badges: true,
          interests: true,
          isActive: true,
          ratings: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          productCategoryId: true,
          user: { select: userSelect },
          productCategory: { select: productCategorySelect },
          comments: { select: commentSelect },
          likes: { select: likeSelect },
        },
        where: {
          likes: { some: { userId } },
        },
      });

      if (!products) {
        return new ErrorService.NotFoundError("No se encontraron productos");
      }

      return products;
    } catch (error) {
      console.error("Error al obtener los productos favoritos:", error);
      return new ErrorService.InternalServerError("Error al obtener los productos favoritos");
    }
  },
  getMyProducts: async ({ userId, take, skip, orderBy }: { userId: string | undefined } & PaginationProps) => {
    try {
      const { field = "name", direction = "asc" } = orderBy || {};
      const orderByClause = { [field]: direction };
      const products: Product[] = await prisma.product.findMany({
        where: { userId },
        select: {
          id: true,
          sku: true,
          barcode: true,
          color: true,
          brand: true,
          name: true,
          description: true,
          price: true,
          images: true,
          hasOffer: true,
          offerPrice: true,
          stock: true,
          isExchangeable: true,
          ratingCount: true,
          reviewsNumber: true,
          badges: true,
          interests: true,
          isActive: true,
          ratings: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          productCategoryId: true,
          user: { select: userSelect },
          productCategory: { select: productCategorySelect },
          comments: { select: commentSelect },
          likes: { select: likeSelect },
        },
        take,
        skip,
        orderBy: orderByClause,
      });

      if (!products) {
        return new ErrorService.NotFoundError("No se encontraron productos");
      }

      return products;
    } catch (error) {
      console.error("Error al obtener los productos del usuario:", error);
      return new ErrorService.InternalServerError("Error al obtener los productos del usuario");
    }
  },
  addProduct: async ({ input, sellerId }: { input: AddProductInput } & Context) => {
    try {
      if (!sellerId) {
        return new ErrorService.UnAuthorizedError("No autorizado");
      }
      const product: Product = await prisma.product.create({
        data: { ...input, sellerId },
      });
      if (!product) {
        return new ErrorService.InternalServerError("Error al crear el producto");
      }

      return product;
    } catch (error) {
      console.error("Error al crear el producto:", error);
      return new ErrorService.InternalServerError("Error al crear el producto");
    }
  },
  updateProduct: async ({ input, sellerId }: { input: UpdateProductInput } & Context) => {
    try {
      if (!sellerId) {
        return new ErrorService.UnAuthorizedError("No autorizado");
      }
      const { id } = input;
      const parsedId = Number(id);
      const product: Product = await prisma.product.update({
        where: { id: parsedId },
        data: {
          ...input,
          sellerId,
          id: parsedId,
        },
      });

      if (!product) {
        return new ErrorService.InternalServerError("Error al actualizar el producto");
      }

      return product;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return new ErrorService.InternalServerError("Error al actualizar el producto");
    }
  },
  deleteProduct: async ({ id }: { id: number }) => {
    try {
      const product: Product = await prisma.product.delete({
        where: { id: Number(id) },
      });

      if (!product) {
        return new ErrorService.InternalServerError("Error al eliminar el producto");
      }

      return product;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return new ErrorService.InternalServerError("Error al eliminar el producto");
    }
  },
  toggleLikeProduct: async ({ id, sellerId }: { id: number; sellerId: string }) => {
    try {
      // Check if the like already exists
      const existingLike = await prisma.productLike.findFirst({
        where: {
          productId: Number(id),
          sellerId,
        },
      });

      if (existingLike) {
        // Unlike (remove the like)
        await prisma.productLike.delete({
          where: { id: existingLike.id },
        });
      } else {
        // Like (create the like)
        await prisma.productLike.create({
          data: {
            productId: Number(id),
            sellerId,
          },
        });
      }

      // Return the updated product with likes
      return ProductService.getProduct({ id: Number(id) });
    } catch (error) {
      console.error("Error al alternar el like del producto:", error);
      return new ErrorService.InternalServerError("Error al alternar el like del producto");
    }
  },
};
