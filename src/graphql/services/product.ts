import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
// import { Context } from "../../types/context";
import { AddProductInput, UpdateProductInput } from "../resolvers/product";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";

type GetProductsArgs = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  orderBy?: { field: string; direction: "asc" | "desc" };
};

type GetProductsBySellerArgs = GetProductsArgs & {
  sellerId: string;
};

type GetProductsByCategoryArgs = GetProductsArgs & {
  productCategoryId: number;
};

export const ProductService = {
  getProducts: async ({ page = 1, pageSize = 20, isActive, orderBy }: GetProductsArgs) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);
      const { field = "createdAt", direction = "desc" } = orderBy || {};
      const orderByClause = { [field]: direction };

      const where = isActive !== undefined ? { isActive, deletedAt: null } : { deletedAt: null };

      const totalCount = await prisma.product.count({ where });

      const products = await prisma.product.findMany({
        where,
        orderBy: orderByClause,
        skip,
        take,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          hasOffer: true,
          offerPrice: true,
          sellerId: true,
          badges: true,
          brand: true,
          color: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          interests: true,
          isActive: true,
          isExchangeable: true,
          productCategoryId: true,
          condition: true,
          conditionDescription: true,
        },
      });

      return createPaginatedResponse(products, page, pageSize, totalCount);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw new ErrorService.InternalServerError("Error al obtener los productos");
    }
  },

  getProduct: async ({ id }: { id: number }) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          hasOffer: true,
          offerPrice: true,
          sellerId: true,
          badges: true,
          brand: true,
          color: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          interests: true,
          isActive: true,
          isExchangeable: true,
          productCategoryId: true,
          condition: true,
          conditionDescription: true,
        },
      });

      if (!product) {
        throw new ErrorService.NotFoundError("Producto no encontrado");
      }

      return product;
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      if (error instanceof ErrorService.NotFoundError) {
        throw error;
      }
      throw new ErrorService.InternalServerError("Error al obtener el producto");
    }
  },

  getProductsByOwner: async ({ sellerId, page = 1, pageSize = 20, isActive, orderBy }: GetProductsBySellerArgs) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);
      const { field = "createdAt", direction = "desc" } = orderBy || {};
      const orderByClause = { [field]: direction };

      const where = {
        sellerId,
        deletedAt: null,
        ...(isActive !== undefined && { isActive }),
      };

      const totalCount = await prisma.product.count({ where });

      const products = await prisma.product.findMany({
        where,
        orderBy: orderByClause,
        skip,
        take,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          hasOffer: true,
          offerPrice: true,
          sellerId: true,
          badges: true,
          brand: true,
          color: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          interests: true,
          isActive: true,
          isExchangeable: true,
          productCategoryId: true,
          condition: true,
          conditionDescription: true,
        },
      });

      return createPaginatedResponse(products, page, pageSize, totalCount);
    } catch (error) {
      console.error("Error al obtener los productos del propietario:", error);
      throw new ErrorService.InternalServerError("Error al obtener los productos del propietario");
    }
  },

  getProductsByCategory: async ({
    productCategoryId,
    page = 1,
    pageSize = 20,
    isActive,
    orderBy,
  }: GetProductsByCategoryArgs) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);
      const { field = "createdAt", direction = "desc" } = orderBy || {};
      const orderByClause = { [field]: direction };

      const where = {
        productCategoryId,
        deletedAt: null,
        ...(isActive !== undefined && { isActive }),
      };

      const totalCount = await prisma.product.count({ where });

      const products = await prisma.product.findMany({
        where,
        orderBy: orderByClause,
        skip,
        take,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          hasOffer: true,
          offerPrice: true,
          sellerId: true,
          badges: true,
          brand: true,
          color: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          interests: true,
          isActive: true,
          isExchangeable: true,
          productCategoryId: true,
          condition: true,
          conditionDescription: true,
        },
      });

      return createPaginatedResponse(products, page, pageSize, totalCount);
    } catch (error) {
      console.error("Error al obtener los productos por categoría:", error);
      throw new ErrorService.InternalServerError("Error al obtener los productos por categoría");
    }
  },

  getExchangeableProducts: async ({ page = 1, pageSize = 20 }: { page?: number; pageSize?: number }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const where = {
        isExchangeable: true,
        isActive: true,
        deletedAt: null,
      };

      const totalCount = await prisma.product.count({ where });

      const products = await prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          hasOffer: true,
          offerPrice: true,
          sellerId: true,
          badges: true,
          brand: true,
          color: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          interests: true,
          isActive: true,
          isExchangeable: true,
          productCategoryId: true,
          condition: true,
          conditionDescription: true,
        },
      });

      return createPaginatedResponse(products, page, pageSize, totalCount);
    } catch (error) {
      console.error("Error al obtener los productos intercambiables:", error);
      throw new ErrorService.InternalServerError("Error al obtener los productos intercambiables");
    }
  },

  addProduct: async ({ input, sellerId }: { input: AddProductInput; sellerId?: string }) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }

      const product = await prisma.product.create({
        data: {
          ...input,
          sellerId,
          updatedAt: new Date(),
        },
      });

      if (!product) {
        throw new ErrorService.InternalServerError("Error al crear el producto");
      }

      return product;
    } catch (error) {
      console.error("Error al crear el producto:", error);
      if (error instanceof ErrorService.UnAuthorizedError) {
        throw error;
      }
      throw new ErrorService.InternalServerError("Error al crear el producto");
    }
  },

  updateProduct: async ({ input, sellerId }: { input: UpdateProductInput; sellerId?: string }) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }

      const { id, ...data } = input;
      const parsedId = Number(id);

      // Verify product belongs to seller
      const existingProduct = await prisma.product.findUnique({
        where: { id: parsedId },
        select: { sellerId: true },
      });

      if (!existingProduct) {
        throw new ErrorService.NotFoundError("Producto no encontrado");
      }

      if (existingProduct.sellerId !== sellerId) {
        throw new ErrorService.UnAuthorizedError("No tienes permiso para editar este producto");
      }

      const product = await prisma.product.update({
        where: { id: parsedId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return product;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      if (error instanceof ErrorService.UnAuthorizedError || error instanceof ErrorService.NotFoundError) {
        throw error;
      }
      throw new ErrorService.InternalServerError("Error al actualizar el producto");
    }
  },

  deleteProduct: async ({ id }: { id: number }) => {
    try {
      // Soft delete
      const product = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          deletedAt: new Date(),
        },
      });

      if (!product) {
        throw new ErrorService.InternalServerError("Error al eliminar el producto");
      }

      return product;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw new ErrorService.InternalServerError("Error al eliminar el producto");
    }
  },

  toggleProductActive: async ({ id, sellerId }: { id: number; sellerId?: string }) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }

      // Verify product belongs to seller
      const existingProduct = await prisma.product.findUnique({
        where: { id: Number(id) },
        select: { sellerId: true, isActive: true },
      });

      if (!existingProduct) {
        throw new ErrorService.NotFoundError("Producto no encontrado");
      }

      if (existingProduct.sellerId !== sellerId) {
        throw new ErrorService.UnAuthorizedError("No tienes permiso para modificar este producto");
      }

      const product = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          isActive: !existingProduct.isActive,
          updatedAt: new Date(),
        },
      });

      return product;
    } catch (error) {
      console.error("Error al cambiar estado del producto:", error);
      if (error instanceof ErrorService.UnAuthorizedError || error instanceof ErrorService.NotFoundError) {
        throw error;
      }
      throw new ErrorService.InternalServerError("Error al cambiar estado del producto");
    }
  },

  toggleLikeProduct: async ({ id, sellerId }: { id: number; sellerId: string }) => {
    try {
      // Check if the like already exists
      const existingLike = await prisma.productLike.findFirst({
        where: {
          storeProductId: Number(id),
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
            storeProductId: Number(id),
            sellerId,
          },
        });
      }

      // Return the updated product with likes
      return ProductService.getProduct({ id: Number(id) });
    } catch (error) {
      console.error("Error al alternar el like del producto:", error);
      throw new ErrorService.InternalServerError("Error al alternar el like del producto");
    }
  },
};
