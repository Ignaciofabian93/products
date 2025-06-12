import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type ProductCategory } from "../../types/product";

export const ProductCategoriesService = {
  getProductCategories: async () => {
    const productCategories: ProductCategory[] = await prisma.productCategory.findMany({
      select: {
        id: true,
        productCategory: true,
        departmentCategoryId: true,
        keywords: true,
        materialImpactEstimateId: true,
        maxWeight: true,
        minWeight: true,
        size: true,
        weightUnit: true,
        materialImpactEstimate: {
          select: {
            id: true,
            materialType: true,
            maxWeight: true,
            minWeight: true,
            notes: true,
            estimatedCo2SavingsKG: true,
            estimatedWasteSavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
      },
    });

    if (!productCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return productCategories;
  },
  getProductCategory: async ({ id }: { id: number }) => {
    const parsedId = Number(id);
    const productCategory: ProductCategory | null = await prisma.productCategory.findUnique({
      select: {
        id: true,
        productCategory: true,
        departmentCategoryId: true,
        keywords: true,
        materialImpactEstimateId: true,
        maxWeight: true,
        minWeight: true,
        size: true,
        weightUnit: true,
        materialImpactEstimate: {
          select: {
            id: true,
            materialType: true,
            maxWeight: true,
            minWeight: true,
            notes: true,
            estimatedCo2SavingsKG: true,
            estimatedWasteSavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
      },
      where: { id: parsedId },
    });
    return productCategory;
  },
  getProductCategoriesByDepartmentCategory: async ({ id }: { id: number }) => {
    const parsedId = Number(id);
    const productCategories: ProductCategory[] = await prisma.productCategory.findMany({
      select: {
        id: true,
        productCategory: true,
        departmentCategoryId: true,
        keywords: true,
        materialImpactEstimateId: true,
        maxWeight: true,
        minWeight: true,
        size: true,
        weightUnit: true,
        materialImpactEstimate: {
          select: {
            id: true,
            materialType: true,
            maxWeight: true,
            minWeight: true,
            notes: true,
            estimatedCo2SavingsKG: true,
            estimatedWasteSavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
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
