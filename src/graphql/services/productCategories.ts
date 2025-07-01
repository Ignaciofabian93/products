import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type OrderBy } from "../../types/general";
import { type ProductCategory } from "../../types/product";
import { departmentCategorySelect, productCategorySelect } from "./selects/productCategories";

export const ProductCategoriesService = {
  getProductCategories: async ({ take = 20, skip = 0, orderBy }: { take: number; skip: number; orderBy: OrderBy }) => {
    const { field = "name", direction = "asc" } = orderBy || {};
    const orderByClause = { [field]: direction };
    const productCategories: ProductCategory[] = await prisma.productCategory.findMany({
      select: {
        ...productCategorySelect,
        products: {
          select: productCategorySelect,
          orderBy: orderByClause,
          take,
          skip,
        },
      },
    });

    if (!productCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return productCategories;
  },

  getProductCategory: async ({
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
    const orderByClause = { [field]: direction };
    const parsedId = Number(id);
    const productCategory: ProductCategory | null = await prisma.productCategory.findUnique({
      select: {
        ...productCategorySelect,
        products: {
          select: productCategorySelect,
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
    return productCategory;
  },

  getProductCategoriesByDepartmentCategory: async ({
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
    const orderByClause = { [field]: direction };
    const parsedId = Number(id);
    const productCategories: ProductCategory[] = await prisma.productCategory.findMany({
      select: {
        ...productCategorySelect,
        products: {
          select: productCategorySelect,
          orderBy: orderByClause,
          take,
          skip,
        },
      },
      where: { departmentCategoryId: parsedId },
    });

    if (!productCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return productCategories;
  },
};
