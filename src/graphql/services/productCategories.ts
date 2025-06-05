import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";

export const ProductCategoriesService = {
  getProductCategories: async () => {
    const productCategories = await prisma.productCategory.findMany({
      select: {
        id: true,
        productCategory: true,
      },
    });

    if (!productCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return productCategories;
  },
  getProductCategory: async ({ id }: { id: number }) => {
    const parsedId = Number(id);
    const productCategory = await prisma.productCategory.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        productCategory: true,
      },
    });
    return productCategory;
  },
  getProductCategoriesByDepartmentCategory: async ({ id }: { id: number }) => {
    const parsedId = Number(id);

    const productCategories = await prisma.productCategory.findMany({
      where: { departmentCategoryId: parsedId },
      select: {
        id: true,
        productCategory: true,
      },
    });

    if (!productCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return productCategories;
  },
};
