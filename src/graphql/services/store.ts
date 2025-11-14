import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { PaginationInput } from "../../types/general";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";

export const StoreService = {
  getStoreCategories: async () => {
    try {
      const categories = await prisma.storeCategory.findMany();

      if (!categories) {
        throw new ErrorService.NotFoundError("No se han encontrado categorías de tienda");
      }

      return categories;
    } catch (error) {
      console.error("Error al intentar obtener las categorías de tienda", error);
      throw new ErrorService.InternalServerError("Error al intentar obtener las categorías de tienda");
    }
  },
  getStoreSubCategoriesByCategoryId: async ({ storeCategoryId }: { storeCategoryId: number }) => {
    try {
      const parsedId = Number(storeCategoryId);

      const subcategories = await prisma.storeSubCategory.findMany({
        where: {
          storeCategoryId: parsedId,
        },
      });

      if (!subcategories) {
        throw new ErrorService.NotFoundError("No se han encontrado subcategorias");
      }

      return subcategories;
    } catch (error) {
      console.error("Error al intentar obtener subcategorias: ", error);
      throw new ErrorService.InternalServerError(
        "Error al intentar obtener subcategorias según categoría seleccionada",
      );
    }
  },
  getStoreCategory: async ({ id, page = 1, pageSize = 20 }: { id: number } & PaginationInput) => {
    try {
      const parsedId = Number(id);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const category = await prisma.storeCategory.findFirst({
        where: {
          id: parsedId,
        },
        select: {
          id: true,
          category: true,
          href: true,
          subcategories: {
            select: {
              id: true,
              subCategory: true,
              storeCategory: {
                select: {
                  id: true,
                  category: true,
                  href: true,
                },
              },
              href: true,
              _count: {
                select: {
                  storeProducts: true,
                },
              },
            },
            orderBy: {
              subCategory: "asc",
            },
          },
        },
        orderBy: {
          category: "asc",
        },
      });

      if (!category) {
        throw new ErrorService.NotFoundError("Categoría de tienda no encontrada.");
      }

      const totalProductsCount = await prisma.storeProduct.count({
        where: {
          storeSubCategory: {
            storeCategoryId: parsedId,
          },
          isActive: true,
          deletedAt: null,
        },
      });

      const products = await prisma.storeProduct.findMany({
        where: {
          storeSubCategory: {
            storeCategoryId: parsedId,
          },
          isActive: true,
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      });

      return {
        ...category,
        products: createPaginatedResponse(products, totalProductsCount, page, pageSize),
      };
    } catch (error) {
      console.error("Error al intentar obtener la categoría de tienda:", error);
      throw new ErrorService.InternalServerError("No se pudo obtener la categoría de tienda.");
    }
  },
};
