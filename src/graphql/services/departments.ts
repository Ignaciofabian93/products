import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type OrderBy } from "../../types/general";
import { type Department } from "../../types/product";
import { commentSelect, likeSelect, productCategorySelect, productSelect } from "./selects/departments";

export const DepartmentService = {
  getDepartments: async ({ take = 20, skip = 0, orderBy }: { take: number; skip: number; orderBy: OrderBy }) => {
    const { field = "name", direction = "asc" } = orderBy || {};
    const orderByClause = {
      [field]: direction,
    };
    const departments: Department[] = await prisma.department.findMany({
      select: {
        id: true,
        departmentName: true,
        departmentCategories: {
          select: {
            id: true,
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
        },
      },
      orderBy: {
        departmentName: "asc",
      },
    });

    if (!departments.length) {
      return new ErrorService.NotFoundError("No se encontraron departamentos");
    }

    return departments;
  },
  getDepartment: async ({
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
    const department: Department | null = await prisma.department.findFirst({
      where: { id: parsedId },
      select: {
        id: true,
        departmentName: true,
        departmentCategories: {
          select: {
            id: true,
            departmentCategoryName: true,
            departmentId: true,
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
            },
          },
          orderBy: {
            departmentCategoryName: "asc",
          },
        },
      },
      orderBy: {
        departmentName: "asc",
      },
    });

    return department;
  },
};
