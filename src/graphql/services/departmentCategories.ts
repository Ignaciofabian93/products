import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";

export const DepartmentCategoriesService = {
  getDepartmentCategories: async () => {
    const departmentCategories = await prisma.departmentCategory.findMany({
      select: {
        id: true,
        departmentId: true,
        departmentCategory: true,
      },
    });

    if (!departmentCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return departmentCategories;
  },
  getDepartmentCategory: async ({ id }: { id: number }) => {
    const parsedId = Number(id);
    const departmentCategory = await prisma.departmentCategory.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        departmentId: true,
        departmentCategory: true,
      },
    });

    return departmentCategory;
  },
  getDepartmentCategoriesByDepartment: async ({ id }: { id: number }) => {
    const parsedId = Number(id);

    const departmentCategories = await prisma.departmentCategory.findMany({
      where: { departmentId: parsedId },
      select: {
        id: true,
        departmentId: true,
        departmentCategory: true,
      },
    });

    if (!departmentCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return departmentCategories;
  },
};
