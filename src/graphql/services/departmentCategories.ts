import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type OrderBy } from "../../types/general";
import { type DepartmentCategory } from "../../types/product";
import {
  commentSelect,
  departmentSelect,
  likeSelect,
  productCategorySelect,
  productSelect,
} from "./selects/departmentCategories";

export const DepartmentCategoriesService = {
  getDepartmentCategories: async ({
    take = 20,
    skip = 0,
    orderBy,
  }: {
    take: number;
    skip: number;
    orderBy: OrderBy;
  }) => {
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
              orderBy: orderByClause, // Order products by the specified field and direction
              take, // Limit to 5 products per category
              skip, // You can adjust this for pagination
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
  },
  getDepartmentCategory: async ({
    id,
    take = 20,
    skip = 0,
    orderBy,
  }: {
    id: number;
    take: number;
    skip: number;
    orderBy: OrderBy;
  }) => {
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
              orderBy: orderByClause, // Order products by the specified field and direction
              take, // Limit to 5 products per category
              skip, // You can adjust this for pagination
            },
          },
          orderBy: {
            productCategoryName: "asc",
          },
        },
      },
    });

    return departmentCategory;
  },
  getDepartmentCategoriesByDepartment: async ({
    id,
    take = 20,
    skip = 0,
    orderBy,
  }: {
    id: number;
    take: number;
    skip: number;
    orderBy: OrderBy;
  }) => {
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
              orderBy: orderByClause, // Order products by the specified field and direction
              take, // Limit to 5 products per category
              skip, // You can adjust this for pagination
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
  },
};
