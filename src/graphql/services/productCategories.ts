import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type PaginationProps } from "../../types/general";
import { type ProductCategory } from "../../types/product";
import { departmentCategorySelect, productCategorySelect, productSelect } from "./selects/productCategories";

export const ProductCategoriesService = {
  getProductCategories: async ({ take = 20, skip = 0, orderBy }: PaginationProps) => {
    try {
      const { field = "name", direction = "asc" } = orderBy || {};
      const orderByClause = { [field]: direction };
      const productCategories: ProductCategory[] = await prisma.productCategory.findMany({
        select: {
          ...productCategorySelect,
          products: {
            select: productSelect,
            orderBy: orderByClause,
            take,
            skip,
          },
        },
        orderBy: {
          productCategoryName: "asc",
        },
      });

      if (!productCategories.length) {
        return new ErrorService.NotFoundError("No se encontraron categorías");
      }

      return productCategories;
    } catch (error) {
      console.error("Error al obtener las categorías de producto:", error);
      return new ErrorService.InternalServerError("Error al obtener las categorías de producto");
    }
  },

  getProductCategory: async ({ id, take = 20, skip = 0, orderBy }: { id: number } & PaginationProps) => {
    try {
      const { field = "name", direction = "asc" } = orderBy || {};
      const orderByClause = { [field]: direction };
      const parsedId = Number(id);
      const productCategory: ProductCategory | null = await prisma.productCategory.findFirst({
        select: {
          ...productCategorySelect,
          products: {
            select: productSelect,
            orderBy: orderByClause,
            take,
            skip,
          },
          departmentCategory: {
            select: departmentCategorySelect,
          },
        },
        where: { id: parsedId },
      });

      if (!productCategory) {
        return new ErrorService.NotFoundError("No se encontró la categoría de producto");
      }

      return productCategory;
    } catch (error) {
      console.error("Error al obtener la categoría de producto:", error);
      return new ErrorService.InternalServerError("Error al obtener la categoría de producto");
    }
  },

  getProductCategoriesByDepartmentCategory: async ({
    id,
    take = 20,
    skip = 0,
    orderBy,
  }: { id: number } & PaginationProps) => {
    try {
      const { field = "name", direction = "asc" } = orderBy || {};
      const orderByClause = { [field]: direction };
      const parsedId = Number(id);
      const productCategories: ProductCategory[] = await prisma.productCategory.findMany({
        select: {
          ...productCategorySelect,
          products: {
            select: productSelect,
            orderBy: orderByClause,
            take,
            skip,
          },
        },
        orderBy: {
          productCategoryName: "asc",
        },
        where: { departmentCategoryId: parsedId },
      });

      if (!productCategories.length) {
        return new ErrorService.NotFoundError("No se encontraron categorías");
      }

      return productCategories;
    } catch (error) {
      console.error("Error al obtener las categorías de producto por categoría de departamento:", error);
      return new ErrorService.InternalServerError(
        "Error al obtener las categorías de producto por categoría de departamento",
      );
    }
  },
};
