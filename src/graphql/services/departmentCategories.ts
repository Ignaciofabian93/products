import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";

export const DepartmentCategoriesService = {
  getDepartmentCategories: async ({
    departmentId,
    page = 1,
    pageSize = 10,
  }: {
    departmentId: number;
    page?: number;
    pageSize?: number;
  }) => {
    try {
      const parsedId = Number(departmentId);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const totalCount = await prisma.departmentCategory.count({
        where: { departmentId: parsedId },
      });

      const departmentCategories = await prisma.departmentCategory.findMany({
        where: { departmentId: parsedId },
        select: {
          id: true,
          departmentCategoryName: true,
          departmentId: true,
          department: {
            select: {
              id: true,
              departmentName: true,
              departmentImage: true,
            },
          },
          _count: {
            select: {
              productCategory: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          departmentCategoryName: "asc",
        },
      });

      return createPaginatedResponse(departmentCategories, page, pageSize, totalCount);
    } catch (error) {
      console.error("Error al obtener las categorías de departamento:", error);
      throw new ErrorService.InternalServerError("Error al obtener las categorías de departamento.");
    }
  },

  getDepartmentCategory: async ({ id, page = 1, pageSize = 10 }: { id: number; page?: number; pageSize?: number }) => {
    try {
      const parsedId = Number(id);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      const departmentCategory = await prisma.departmentCategory.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          departmentCategoryName: true,
          departmentId: true,
          department: {
            select: {
              id: true,
              departmentName: true,
              departmentImage: true,
            },
          },
        },
      });

      if (!departmentCategory) {
        throw new ErrorService.NotFoundError("Categoría de departamento no encontrada.");
      }

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

      const products = await prisma.product.findMany({
        where: {
          productCategory: {
            departmentCategoryId: parsedId,
          },
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
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        ...departmentCategory,
        productCategories: createPaginatedResponse(productCategories, page, pageSize, totalCount),
        products,
      };
    } catch (error) {
      console.error("Error al obtener la categoría de departamento:", error);
      throw new ErrorService.InternalServerError("Error al obtener la categoría de departamento.");
    }
  },
};
