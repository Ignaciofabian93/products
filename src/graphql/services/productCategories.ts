import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";

export const ProductCategoriesService = {
  getProductCategories: async ({
    departmentCategoryId,
    page = 1,
    pageSize = 10,
  }: {
    departmentCategoryId: number;
    page?: number;
    pageSize?: number;
  }) => {
    try {
      const parsedId = Number(departmentCategoryId);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const totalCount = await prisma.productCategory.count({
        where: { departmentCategoryId: parsedId },
      });

      const productCategories = await prisma.productCategory.findMany({
        where: { departmentCategoryId: parsedId },
        select: {
          id: true,
          productCategoryName: true,
          departmentCategoryId: true,
          keywords: true,
          size: true,
          averageWeight: true,
          weightUnit: true,
          departmentCategory: {
            select: {
              id: true,
              departmentCategoryName: true,
              department: {
                select: {
                  id: true,
                  departmentName: true,
                  departmentImage: true,
                },
              },
            },
          },
          _count: {
            select: {
              product: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          productCategoryName: "asc",
        },
      });

      return createPaginatedResponse(productCategories, page, pageSize, totalCount);
    } catch (error) {
      console.error("Error al obtener las categorías de producto:", error);
      throw new ErrorService.InternalServerError("Error al obtener las categorías de producto.");
    }
  },

  getProductCategory: async ({ id, page = 1, pageSize = 10 }: { id: number; page?: number; pageSize?: number }) => {
    try {
      const parsedId = Number(id);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const productCategory = await prisma.productCategory.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          productCategoryName: true,
          departmentCategoryId: true,
          keywords: true,
          size: true,
          averageWeight: true,
          weightUnit: true,
          departmentCategory: {
            select: {
              id: true,
              departmentCategoryName: true,
              department: {
                select: {
                  id: true,
                  departmentName: true,
                  departmentImage: true,
                },
              },
            },
          },
        },
      });

      if (!productCategory) {
        throw new ErrorService.NotFoundError("Categoría de producto no encontrada.");
      }

      const totalCount = await prisma.product.count({
        where: {
          productCategoryId: parsedId,
          isActive: true,
        },
      });

      const products = await prisma.product.findMany({
        where: {
          productCategoryId: parsedId,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          hasOffer: true,
          offerPrice: true,
          images: true,
          badges: true,
          brand: true,
          color: true,
          condition: true,
          isActive: true,
          createdAt: true,
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        ...productCategory,
        products: createPaginatedResponse(products, page, pageSize, totalCount),
      };
    } catch (error) {
      console.error("Error al obtener la categoría de producto:", error);
      throw new ErrorService.InternalServerError("Error al obtener la categoría de producto.");
    }
  },
};
