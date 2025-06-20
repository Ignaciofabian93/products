import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type DepartmentCategory } from "../../types/product";

export const DepartmentCategoriesService = {
  getDepartmentCategories: async () => {
    const departmentCategories: DepartmentCategory[] = await prisma.departmentCategory.findMany({
      select: {
        id: true,
        departmentId: true,
        department: {
          select: {
            id: true,
            departmentName: true,
          },
        },
        departmentCategoryName: true,
        productCategories: {
          select: {
            id: true,
            productCategoryName: true,
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
            products: {
              select: {
                id: true,
                sku: true,
                barcode: true,
                color: true,
                brand: true,
                name: true,
                description: true,
                price: true,
                images: true,
                hasOffer: true,
                offerPrice: true,
                stock: true,
                isExchangeable: true,
                interests: true,
                isActive: true,
                ratings: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    surnames: true,
                    profileImage: true,
                    isCompany: true,
                    businessName: true,
                    phone: true,
                    address: true,
                    county: {
                      select: {
                        id: true,
                        county: true,
                      },
                    },
                    city: {
                      select: {
                        id: true,
                        city: true,
                      },
                    },
                    region: {
                      select: {
                        id: true,
                        region: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!departmentCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return departmentCategories;
  },
  getDepartmentCategory: async ({ id }: { id: number }) => {
    const parsedId = Number(id);
    const departmentCategory: DepartmentCategory | null = await prisma.departmentCategory.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        departmentId: true,
        department: {
          select: {
            id: true,
            departmentName: true,
          },
        },
        departmentCategoryName: true,
        productCategories: {
          select: {
            id: true,
            productCategoryName: true,
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
            products: {
              select: {
                id: true,
                sku: true,
                barcode: true,
                color: true,
                brand: true,
                name: true,
                description: true,
                price: true,
                images: true,
                hasOffer: true,
                offerPrice: true,
                stock: true,
                isExchangeable: true,
                interests: true,
                isActive: true,
                ratings: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    surnames: true,
                    profileImage: true,
                    isCompany: true,
                    businessName: true,
                    phone: true,
                    address: true,
                    county: {
                      select: {
                        id: true,
                        county: true,
                      },
                    },
                    city: {
                      select: {
                        id: true,
                        city: true,
                      },
                    },
                    region: {
                      select: {
                        id: true,
                        region: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return departmentCategory;
  },
  getDepartmentCategoriesByDepartment: async ({ id }: { id: number }) => {
    const parsedId = Number(id);

    const departmentCategories: DepartmentCategory[] = await prisma.departmentCategory.findMany({
      where: { departmentId: parsedId },
      select: {
        id: true,
        departmentId: true,
        department: {
          select: {
            id: true,
            departmentName: true,
          },
        },
        departmentCategoryName: true,
        productCategories: {
          select: {
            id: true,
            productCategoryName: true,
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
            products: {
              select: {
                id: true,
                sku: true,
                barcode: true,
                color: true,
                brand: true,
                name: true,
                description: true,
                price: true,
                images: true,
                hasOffer: true,
                offerPrice: true,
                stock: true,
                isExchangeable: true,
                interests: true,
                isActive: true,
                ratings: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    surnames: true,
                    profileImage: true,
                    isCompany: true,
                    businessName: true,
                    phone: true,
                    address: true,
                    county: {
                      select: {
                        id: true,
                        county: true,
                      },
                    },
                    city: {
                      select: {
                        id: true,
                        city: true,
                      },
                    },
                    region: {
                      select: {
                        id: true,
                        region: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!departmentCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return departmentCategories;
  },
};
