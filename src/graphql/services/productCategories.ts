import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type ProductCategory } from "../../types/product";

export const ProductCategoriesService = {
  getProductCategories: async () => {
    const productCategories: ProductCategory[] = await prisma.productCategory.findMany({
      select: {
        id: true,
        productCategoryName: true,
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
        departmentCategory: {
          select: {
            id: true,
            departmentCategoryName: true,
            departmentId: true,
            department: {
              select: {
                id: true,
                departmentName: true,
              },
            },
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
        productCategoryName: true,
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
        departmentCategory: {
          select: {
            id: true,
            departmentCategoryName: true,
            departmentId: true,
            department: {
              select: {
                id: true,
                departmentName: true,
              },
            },
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
        productCategoryName: true,
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
        departmentCategory: {
          select: {
            id: true,
            departmentCategoryName: true,
            departmentId: true,
            department: {
              select: {
                id: true,
                departmentName: true,
              },
            },
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
