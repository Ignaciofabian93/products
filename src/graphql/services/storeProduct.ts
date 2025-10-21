import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";
import { PaginationInput } from "../resolvers/storeProduct";

export const StoreProductService = {
  // Get store category with its subcategories (for catalog/navigation)
  getStoreCategory: async ({ id, page = 1, pageSize = 10 }: { id: number } & PaginationInput) => {
    try {
      const parsedId = Number(id);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      // Get the category with subcategories
      const storeCategory = await prisma.storeCategory.findUnique({
        where: { id: parsedId },
        include: {
          subcategories: {
            skip,
            take,
            orderBy: {
              subCategory: "asc",
            },
          },
        },
      });

      if (!storeCategory) {
        throw new ErrorService.NotFoundError("Categoría de tienda no encontrada.");
      }

      // Count total subcategories for pagination
      const totalCount = await prisma.storeSubCategory.count({
        where: { storeCategoryId: parsedId },
      });

      // Get all products for this category (across all subcategories)
      const products = await prisma.storeProduct.findMany({
        where: {
          storeSubCategory: { storeCategoryId: parsedId },
          isActive: true,
          deletedAt: null,
        },
        include: {
          storeSubCategory: {
            select: {
              id: true,
              subCategory: true,
              storeCategoryId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        ...storeCategory,
        subcategories: createPaginatedResponse(storeCategory.subcategories, page, pageSize, totalCount),
        products,
      };
    } catch (error) {
      console.error("Error in getStoreCategory:", error);
      throw new ErrorService.InternalServerError("Error al intentar obtener la categoría de tienda.");
    }
  },

  // Get all subcategories for a store category (paginated)
  getStoreSubCategories: async ({
    storeCategoryId,
    page = 1,
    pageSize = 10,
  }: { storeCategoryId: number } & PaginationInput) => {
    try {
      const parsedId = Number(storeCategoryId);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const totalCount = await prisma.storeSubCategory.count({
        where: { storeCategoryId: parsedId },
      });

      const subcategories = await prisma.storeSubCategory.findMany({
        where: { storeCategoryId: parsedId },
        include: {
          storeCategory: {
            select: {
              id: true,
              category: true,
            },
          },
          _count: {
            select: {
              storeProducts: {
                where: {
                  isActive: true,
                  deletedAt: null,
                },
              },
            },
          },
        },
        skip,
        take,
        orderBy: {
          subCategory: "asc",
        },
      });

      return createPaginatedResponse(subcategories, page, pageSize, totalCount);
    } catch (error) {
      console.error("Error in getStoreSubCategories:", error);
      throw new ErrorService.InternalServerError("Error al intentar obtener las subcategorías.");
    }
  },

  // Get single subcategory with breadcrumb and paginated products
  getStoreSubCategory: async ({ id, page = 1, pageSize = 10 }: { id: number } & PaginationInput) => {
    try {
      const parsedId = Number(id);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      // Get subcategory with parent category (for breadcrumb)
      const subcategory = await prisma.storeSubCategory.findUnique({
        where: { id: parsedId },
        include: {
          storeCategory: {
            select: {
              id: true,
              category: true,
            },
          },
        },
      });

      if (!subcategory) {
        throw new ErrorService.NotFoundError("Subcategoría no encontrada.");
      }

      // Get paginated products for this subcategory
      const totalCount = await prisma.storeProduct.count({
        where: {
          subcategoryId: parsedId,
          isActive: true,
          deletedAt: null,
        },
      });

      const products = await prisma.storeProduct.findMany({
        where: {
          subcategoryId: parsedId,
          isActive: true,
          deletedAt: null,
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        ...subcategory,
        products: createPaginatedResponse(products, page, pageSize, totalCount),
      };
    } catch (error) {
      console.error("Error in getStoreSubCategory:", error);
      throw new ErrorService.InternalServerError("Error al intentar obtener la subcategoría.");
    }
  },

  // Get all store products (paginated)
  getStoreProducts: async ({ page = 1, pageSize = 10, isActive }: PaginationInput & { isActive?: boolean }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const whereClause = {
        deletedAt: null,
        ...(isActive !== undefined && { isActive }),
      };

      const totalCount = await prisma.storeProduct.count({ where: whereClause });

      const products = await prisma.storeProduct.findMany({
        where: whereClause,
        include: {
          storeSubCategory: {
            select: {
              id: true,
              subCategory: true,
              storeCategory: {
                select: {
                  id: true,
                  category: true,
                },
              },
            },
          },
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      });

      return createPaginatedResponse(products, page, pageSize, totalCount);
    } catch (error) {
      console.error("Error in getStoreProducts:", error);
      throw new ErrorService.InternalServerError("Error al intentar obtener los productos de tienda.");
    }
  },

  // Get single store product
  getStoreProduct: async ({ id }: { id: number }) => {
    try {
      const parsedId = Number(id);

      const product = await prisma.storeProduct.findFirst({
        where: {
          id: parsedId,
          deletedAt: null,
        },
        include: {
          storeSubCategory: {
            select: {
              id: true,
              subCategory: true,
              storeCategory: {
                select: {
                  id: true,
                  category: true,
                },
              },
            },
          },
          materials: {
            include: {
              material: true,
            },
          },
          productVariant: true,
        },
      });

      if (!product) {
        throw new ErrorService.NotFoundError("Producto no encontrado.");
      }

      return product;
    } catch (error) {
      console.error("Error in getStoreProduct:", error);
      throw new ErrorService.InternalServerError("Error al intentar obtener el producto.");
    }
  },

  // Get store products by seller (paginated)
  getStoreProductsBySeller: async ({
    sellerId,
    page = 1,
    pageSize = 10,
    isActive,
  }: { sellerId: string } & PaginationInput & { isActive?: boolean }) => {
    try {
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const whereClause = {
        sellerId,
        deletedAt: null,
        ...(isActive !== undefined && { isActive }),
      };

      const totalCount = await prisma.storeProduct.count({ where: whereClause });

      const products = await prisma.storeProduct.findMany({
        where: whereClause,
        include: {
          storeSubCategory: {
            select: {
              id: true,
              subCategory: true,
              storeCategory: {
                select: {
                  id: true,
                  category: true,
                },
              },
            },
          },
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      });

      return createPaginatedResponse(products, page, pageSize, totalCount);
    } catch (error) {
      console.error("Error in getStoreProductsBySeller:", error);
      throw new ErrorService.InternalServerError("Error al intentar obtener los productos del vendedor.");
    }
  },

  // Get store products by subcategory (paginated)
  getStoreProductsBySubCategory: async ({
    subcategoryId,
    page = 1,
    pageSize = 10,
    isActive,
  }: { subcategoryId: number } & PaginationInput & { isActive?: boolean }) => {
    try {
      const parsedId = Number(subcategoryId);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const whereClause = {
        subcategoryId: parsedId,
        deletedAt: null,
        ...(isActive !== undefined && { isActive }),
      };

      const totalCount = await prisma.storeProduct.count({ where: whereClause });

      const products = await prisma.storeProduct.findMany({
        where: whereClause,
        include: {
          storeSubCategory: {
            select: {
              id: true,
              subCategory: true,
              storeCategory: {
                select: {
                  id: true,
                  category: true,
                },
              },
            },
          },
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      });

      return createPaginatedResponse(products, page, pageSize, totalCount);
    } catch (error) {
      console.error("Error in getStoreProductsBySubCategory:", error);
      throw new ErrorService.InternalServerError("Error al intentar obtener los productos de la subcategoría.");
    }
  },
};
