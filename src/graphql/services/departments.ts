import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type Department } from "../../types/product";

export const DepartmentService = {
  getDepartments: async () => {
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
                    ratingCount: true,
                    reviewsNumber: true,
                    badges: true,
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
                    comments: {
                      select: {
                        id: true,
                        comment: true,
                        user: {
                          select: {
                            id: true,
                            name: true,
                            businessName: true,
                          },
                        },
                      },
                    },
                    likes: {
                      select: {
                        id: true,
                        userId: true,
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

    if (!departments.length) {
      return new ErrorService.NotFoundError("No se encontraron departamentos");
    }

    return departments;
  },
  getDepartment: async ({ id }: { id: number }) => {
    const parsedId = Number(id);
    const department: Department | null = await prisma.department.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        departmentName: true,
        departmentCategories: {
          select: {
            id: true,
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
                    ratingCount: true,
                    reviewsNumber: true,
                    badges: true,
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
                    comments: {
                      select: {
                        id: true,
                        comment: true,
                        user: {
                          select: {
                            id: true,
                            name: true,
                            businessName: true,
                          },
                        },
                      },
                    },
                    likes: {
                      select: {
                        id: true,
                        userId: true,
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

    return department;
  },
};
