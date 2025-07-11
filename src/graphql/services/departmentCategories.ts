import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type PaginationProps } from "../../types/general";
import { type DepartmentCategory } from "../../types/product";
import {
  commentSelect,
  departmentSelect,
  likeSelect,
  productCategorySelect,
  productSelect,
} from "./selects/departmentCategories";

export const DepartmentCategoriesService = {
  getDepartmentCategories: async ({ take = 20, skip = 0, orderBy }: PaginationProps) => {
    try {
      const { field = "name", direction = "asc" } = orderBy || {};
      const orderByClause = {
        [field]: direction,
      };
      const departmentCategories: DepartmentCategory[] = await prisma.departmentCategory.findMany({
        select: {
          id: true,
          departmentId: true,
          department: {
            select: departmentSelect,
          },
          departmentCategoryName: true,
          productCategories: {
            select: {
              ...productCategorySelect,
              products: {
                select: {
                  ...productSelect,
                  comments: {
                    select: commentSelect,
                  },
                  likes: {
                    select: likeSelect,
                  },
                },
                orderBy: orderByClause,
                take,
                skip,
              },
            },
            orderBy: {
              productCategoryName: "asc",
            },
          },
        },
        orderBy: {
          departmentCategoryName: "asc",
        },
      });

      if (!departmentCategories.length) {
        return new ErrorService.NotFoundError("No se encontraron categorías");
      }

      return departmentCategories;
    } catch (error) {
      console.error("Error al obtener las categorías de departamento:", error);
      return new ErrorService.InternalServerError("Error al obtener las categorías de departamento");
    }
  },
  getDepartmentCategory: async ({ id, take = 20, skip = 0, orderBy }: { id: number } & PaginationProps) => {
    try {
      const { field = "name", direction = "asc" } = orderBy || {};
      const orderByClause = {
        [field]: direction,
      };
      const parsedId = Number(id);
      const departmentCategory: DepartmentCategory | null = await prisma.departmentCategory.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          departmentId: true,
          department: {
            select: departmentSelect,
          },
          departmentCategoryName: true,
          productCategories: {
            select: {
              ...productCategorySelect,
              products: {
                select: {
                  ...productSelect,
                  comments: {
                    select: commentSelect,
                  },
                  likes: {
                    select: likeSelect,
                  },
                },
                orderBy: orderByClause,
                take,
                skip,
              },
            },
            orderBy: {
              productCategoryName: "asc",
            },
          },
        },
      });

      return departmentCategory;
    } catch (error) {
      console.error("Error al obtener la categoría de departamento:", error);
      return new ErrorService.InternalServerError("Error al obtener la categoría de departamento");
    }
  },
  getDepartmentCategoriesByDepartment: async ({
    id,
    take = 20,
    skip = 0,
    orderBy,
  }: { id: number } & PaginationProps) => {
    try {
      const { field = "name", direction = "asc" } = orderBy || {};
      const orderByClause = {
        [field]: direction,
      };
      const parsedId = Number(id);

      const departmentCategories: DepartmentCategory[] = await prisma.departmentCategory.findMany({
        where: { departmentId: parsedId },
        select: {
          id: true,
          departmentId: true,
          department: {
            select: departmentSelect,
          },
          departmentCategoryName: true,
          productCategories: {
            select: {
              ...productCategorySelect,
              products: {
                select: {
                  ...productSelect,
                  comments: {
                    select: commentSelect,
                  },
                  likes: {
                    select: likeSelect,
                  },
                },
                orderBy: orderByClause,
                take,
                skip,
              },
            },
            orderBy: {
              productCategoryName: "asc",
            },
          },
        },
        orderBy: {
          departmentCategoryName: "asc",
        },
      });

      if (!departmentCategories.length) {
        return new ErrorService.NotFoundError("No se encontraron categorías");
      }

      return departmentCategories;
    } catch (error) {
      console.error("Error al obtener las categorías de departamento por departamento:", error);
      return new ErrorService.InternalServerError("Error al obtener las categorías de departamento por departamento");
    }
  },
};
