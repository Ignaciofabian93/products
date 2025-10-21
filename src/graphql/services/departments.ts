import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";

export const DepartmentService = {
  // Get single department with paginated categories and all products
  getDepartment: async ({ id, page = 1, pageSize = 10 }: { id: number; page?: number; pageSize?: number }) => {
    try {
      const parsedId = Number(id);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      // Get the department
      const department = await prisma.department.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          departmentName: true,
          departmentImage: true,
          departmentCategory: {
            select: {
              id: true,
              departmentCategoryName: true,
              productCategory: {
                select: {
                  id: true,
                  productCategoryName: true,
                },
              },
            },
          },
        },
      });

      if (!department) {
        throw new ErrorService.NotFoundError("Departamento no encontrado.");
      }

      // Get paginated department categories
      const totalCategoriesCount = await prisma.departmentCategory.count({
        where: { departmentId: parsedId },
      });

      const departmentCategories = await prisma.departmentCategory.findMany({
        where: { departmentId: parsedId },
        select: {
          id: true,
          departmentCategoryName: true,
          departmentId: true,
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

      // Get all products for this department (across all categories)
      const products = await prisma.product.findMany({
        where: {
          productCategory: {
            departmentCategory: {
              departmentId: parsedId,
            },
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
        ...department,
        departmentCategories: createPaginatedResponse(departmentCategories, page, pageSize, totalCategoriesCount),
        products,
      };
    } catch (error) {
      console.error("Error al obtener el departamento:", error);
      throw new ErrorService.InternalServerError("Error al obtener el departamento.");
    }
  },
};
