import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type OrderBy } from "../../types/general";
import { type ProductCategory } from "../../types/product";

export const ProductCategoriesService = {
  getProductCategories: async ({ take = 20, skip = 0, orderBy }: { take: number; skip: number; orderBy: OrderBy }) => {
    const { field = "name", direction = "asc" } = orderBy || {};
    const orderByClause = {
      [field]: direction,
    };
    const productCategories: ProductCategory[] = await prisma.productCategory.findMany({
      select: {
        id: true,
        productCategoryName: true,
        departmentCategoryId: true,
        keywords: true,
        size: true,
        weightUnit: true,
        averageWeight: true,
        firstMaterialTypeId: true,
        firstMaterialTypeQuantity: true,
        firstMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        secondMaterialTypeId: true,
        secondMaterialTypeQuantity: true,
        secondMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        thirdMaterialTypeId: true,
        thirdMaterialTypeQuantity: true,
        thirdMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        fourthMaterialTypeId: true,
        fourthMaterialTypeQuantity: true,
        fourthMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        fifthMaterialTypeId: true,
        fifthMaterialTypeQuantity: true,
        fifthMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
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
          orderBy: orderByClause, // Order products by the specified field and direction
          take, // Limit to 5 products per category
          skip, // You can adjust this for pagination
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
    const orderByClause = {
      [field]: direction,
    };
    const parsedId = Number(id);
    const productCategory: ProductCategory | null = await prisma.productCategory.findUnique({
      select: {
        id: true,
        productCategoryName: true,
        departmentCategoryId: true,
        keywords: true,
        size: true,
        weightUnit: true,
        averageWeight: true,
        firstMaterialTypeId: true,
        firstMaterialTypeQuantity: true,
        firstMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        secondMaterialTypeId: true,
        secondMaterialTypeQuantity: true,
        secondMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        thirdMaterialTypeId: true,
        thirdMaterialTypeQuantity: true,
        thirdMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        fourthMaterialTypeId: true,
        fourthMaterialTypeQuantity: true,
        fourthMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        fifthMaterialTypeId: true,
        fifthMaterialTypeQuantity: true,
        fifthMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
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
          orderBy: orderByClause, // Order products by the specified field and direction
          take, // Limit to 5 products per category
          skip, // You can adjust this for pagination
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
    const orderByClause = {
      [field]: direction,
    };
    const parsedId = Number(id);
    const productCategories: ProductCategory[] = await prisma.productCategory.findMany({
      select: {
        id: true,
        productCategoryName: true,
        departmentCategoryId: true,
        keywords: true,
        size: true,
        weightUnit: true,
        averageWeight: true,
        firstMaterialTypeId: true,
        firstMaterialTypeQuantity: true,
        firstMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        secondMaterialTypeId: true,
        secondMaterialTypeQuantity: true,
        secondMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        thirdMaterialTypeId: true,
        thirdMaterialTypeQuantity: true,
        thirdMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        fourthMaterialTypeId: true,
        fourthMaterialTypeQuantity: true,
        fourthMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
            estimatedWaterSavingsLT: true,
          },
        },
        fifthMaterialTypeId: true,
        fifthMaterialTypeQuantity: true,
        fifthMaterialType: {
          select: {
            id: true,
            materialType: true,
            estimatedCo2SavingsKG: true,
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
          orderBy: orderByClause, // Order products by the specified field and direction
          take, // Limit to 5 products per category
          skip, // You can adjust this for pagination
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
