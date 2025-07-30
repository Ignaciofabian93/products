import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type PaginationProps } from "../../types/general";
import { type Department } from "../../types/product";
import { commentSelect, likeSelect, productCategorySelect, productSelect } from "./selects/departments";

export const DepartmentService = {
  getDepartments: async ({ take = 20, skip = 0, orderBy }: PaginationProps) => {
    try {
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
    } catch (error) {
      console.error("Error al obtener los departamentos:", error);
      return new ErrorService.InternalServerError("Error al obtener los departamentos");
    }
  },
  getDepartment: async ({ id, take = 20, skip = 0, orderBy }: { id: number } & PaginationProps) => {
    try {
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
                    orderBy: orderByClause,
                    take,
                    skip,
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
    } catch (error) {
      console.error("Error al obtener el departamento:", error);
      return new ErrorService.InternalServerError("Error al obtener el departamento");
    }
  },
  getProductsByDepartment: async ({ departmentId, take = 20 }: { departmentId: number; take: number }) => {
    try {
      const parsedDepartmentId = Number(departmentId);
      const products = await prisma.product.findMany({
        where: {
          productCategory: {
            departmentCategory: {
              departmentId: parsedDepartmentId,
            },
          },
        },
        select: {
          ...productSelect,
          productCategory: {
            select: {
              ...productCategorySelect,
              departmentCategory: {
                select: {
                  id: true,
                  departmentCategoryName: true,
                },
              },
            },
          },
          comments: {
            select: commentSelect,
          },
          likes: {
            select: likeSelect,
          },
        },
        take,
      });

      if (!products.length) {
        return new ErrorService.NotFoundError("No se encontraron productos en este departamento");
      }

      return products;
    } catch (error) {
      console.error("Error al obtener los productos del departamento:", error);
      return new ErrorService.InternalServerError("Error al obtener los productos del departamento");
    }
  },
};
