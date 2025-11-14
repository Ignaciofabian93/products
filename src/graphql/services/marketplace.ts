import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { Context } from "../../types/context";
import { PaginationInput } from "../../types/general";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";

export const MarketplaceService = {
  getDepartments: async ({ sellerId }: Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado.");
      }

      const departments = await prisma.department.findMany({
        orderBy: {
          departmentName: "asc",
        },
      });

      if (!departments) {
        throw new ErrorService.NotFoundError("No se encontraron departamentos.");
      }

      return departments;
    } catch (error) {
      console.error("Error al obtener los departamentos:", error);
      throw new ErrorService.InternalServerError("Error al obtener los departamentos.");
    }
  },
  getDepartmentCategoriesByDepartmentId: async ({ departmentId, sellerId }: { departmentId: number } & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado.");
      }
      const parsedId = Number(departmentId);
      const departmentCategories = await prisma.departmentCategory.findMany({
        where: {
          departmentId: parsedId,
        },
        orderBy: {
          departmentCategoryName: "asc",
        },
      });

      if (!departmentCategories) {
        throw new ErrorService.NotFoundError("No se encontraron categorías de departamento.");
      }

      return departmentCategories;
    } catch (error) {
      console.error("Error al obtener las categorías de departamento:", error);
      throw new ErrorService.InternalServerError("Error al obtener las categorías de departamento.");
    }
  },
  getProductCategoriesByDepartmentCategoryId: async ({
    departmentCategoryId,
    sellerId,
  }: { departmentCategoryId: number } & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado.");
      }

      const parsedId = Number(departmentCategoryId);
      const productCategories = await prisma.productCategory.findMany({
        where: {
          departmentCategoryId: parsedId,
        },
        include: {
          materials: {
            include: {
              material: true,
            },
          },
        },
        orderBy: {
          productCategoryName: "asc",
        },
      });

      if (!productCategories) {
        throw new ErrorService.NotFoundError("No se encontraron categorías de productos.");
      }

      return productCategories;
    } catch (error) {
      console.error("Error al obtener las categorías de productos:", error);
      throw new ErrorService.InternalServerError("Error al obtener las categorías de productos.");
    }
  },
  getDepartment: async ({ id, page = 1, pageSize = 20 }: { id: number } & PaginationInput) => {
    try {
      const parsedId = Number(id);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      // Get department with full category structure (no pagination on categories)
      const department = await prisma.department.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          departmentName: true,
          departmentImage: true,
          href: true,
          departmentCategory: {
            select: {
              id: true,
              departmentCategoryName: true,
              departmentId: true,
              href: true,
              productCategory: {
                select: {
                  id: true,
                  productCategoryName: true,
                  departmentCategoryId: true,
                  keywords: true,
                  size: true,
                  averageWeight: true,
                  weightUnit: true,
                  href: true,
                  _count: {
                    select: {
                      product: true, // Count products in each category
                    },
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
      });

      if (!department) {
        throw new ErrorService.NotFoundError("Departamento no encontrado.");
      }

      // Get total count of ALL products in this department
      const totalProductsCount = await prisma.product.count({
        where: {
          productCategory: {
            departmentCategory: {
              departmentId: parsedId,
            },
          },
          isActive: true,
          deletedAt: null,
        },
      });

      // Get paginated products for this department (across all categories)
      const products = await prisma.product.findMany({
        where: {
          productCategory: {
            departmentCategory: {
              departmentId: parsedId,
            },
          },
          isActive: true,
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      });

      // Return department structure with paginated products
      return {
        ...department,
        products: createPaginatedResponse(products, totalProductsCount, page, pageSize),
      };
    } catch (error) {
      console.error("Error al obtener el departamento:", error);
      throw new ErrorService.InternalServerError("Error al obtener el departamento.");
    }
  },
  getDepartmentCategories: async ({
    departmentId,
    page = 1,
    pageSize = 20,
  }: {
    departmentId: number;
  } & PaginationInput) => {
    try {
      const parsedId = Number(departmentId);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      // Get department info for breadcrumbs
      const department = await prisma.department.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          departmentName: true,
          departmentImage: true,
          href: true,
        },
      });

      if (!department) {
        throw new ErrorService.NotFoundError("Departamento no encontrado.");
      }

      // Get all department categories with product category structure (no pagination on categories)
      const departmentCategories = await prisma.departmentCategory.findMany({
        where: { departmentId: parsedId },
        select: {
          id: true,
          departmentCategoryName: true,
          departmentId: true,
          href: true,
          productCategory: {
            select: {
              id: true,
              productCategoryName: true,
              departmentCategoryId: true,
              keywords: true,
              size: true,
              averageWeight: true,
              weightUnit: true,
              href: true,
              _count: {
                select: {
                  product: true,
                },
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
      });

      // Get total count of ALL products in this department
      const totalProductsCount = await prisma.product.count({
        where: {
          productCategory: {
            departmentCategory: {
              departmentId: parsedId,
            },
          },
          isActive: true,
          deletedAt: null,
        },
      });

      // Get paginated products for this department (across all categories)
      const products = await prisma.product.findMany({
        where: {
          productCategory: {
            departmentCategory: {
              departmentId: parsedId,
            },
          },
          isActive: true,
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      });

      return {
        department,
        departmentCategories,
        products: createPaginatedResponse(products, totalProductsCount, page, pageSize),
      };
    } catch (error) {
      console.error("Error al obtener las categorías de departamento:", error);
      throw new ErrorService.InternalServerError("Error al obtener las categorías de departamento.");
    }
  },
  getDepartmentCategory: async ({ id, page = 1, pageSize = 20 }: { id: number } & PaginationInput) => {
    try {
      const parsedId = Number(id);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      // Get department category with full product category structure (no pagination on categories)
      const departmentCategory = await prisma.departmentCategory.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          departmentCategoryName: true,
          departmentId: true,
          href: true,
          department: {
            select: {
              id: true,
              departmentName: true,
              departmentImage: true,
              href: true,
            },
          },
          productCategory: {
            select: {
              id: true,
              productCategoryName: true,
              departmentCategoryId: true,
              keywords: true,
              size: true,
              averageWeight: true,
              weightUnit: true,
              href: true,
              materials: {
                include: {
                  material: true,
                },
              },
              _count: {
                select: {
                  product: true, // Count products in each category
                },
              },
            },
            orderBy: {
              productCategoryName: "asc",
            },
          },
        },
      });

      console.log("DEPARTMENT CATEGORY: ", departmentCategory);

      if (!departmentCategory) {
        throw new ErrorService.NotFoundError("Categoría de departamento no encontrada.");
      }

      // Get total count of ALL products in this department category
      const totalProductsCount = await prisma.product.count({
        where: {
          productCategory: {
            departmentCategoryId: parsedId,
          },
          isActive: true,
          deletedAt: null,
        },
      });

      // Get paginated products for this department category (across all product categories)
      const products = await prisma.product.findMany({
        where: {
          productCategory: {
            departmentCategoryId: parsedId,
          },
          isActive: true,
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      });

      // Return department category structure with paginated products
      return {
        ...departmentCategory,
        products: createPaginatedResponse(products, totalProductsCount, page, pageSize),
      };
    } catch (error) {
      console.error("Error al obtener la categoría de departamento:", error);
      throw new ErrorService.InternalServerError("Error al obtener la categoría de departamento.");
    }
  },
  getProductCategories: async ({
    departmentCategoryId,
    page = 1,
    pageSize = 20,
  }: {
    departmentCategoryId: number;
  } & PaginationInput) => {
    try {
      const parsedId = Number(departmentCategoryId);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      // Get department category with department info for breadcrumbs
      const departmentCategory = await prisma.departmentCategory.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          departmentCategoryName: true,
          departmentId: true,
          href: true,
          department: {
            select: {
              id: true,
              departmentName: true,
              departmentImage: true,
              href: true,
            },
          },
        },
      });

      if (!departmentCategory) {
        throw new ErrorService.NotFoundError("Categoría de departamento no encontrada.");
      }

      // Get all product categories with materials (no pagination on categories)
      const productCategories = await prisma.productCategory.findMany({
        where: { departmentCategoryId: parsedId },
        select: {
          id: true,
          productCategoryName: true,
          departmentCategoryId: true,
          keywords: true,
          size: true,
          averageWeight: true,
          weightUnit: true,
          href: true,
          materials: {
            select: {
              id: true,
              productCategoryId: true,
              materialTypeId: true,
              quantity: true,
              unit: true,
              isPrimary: true,
              createdAt: true,
              updatedAt: true,
              material: {
                select: {
                  id: true,
                  materialType: true,
                  estimatedCo2SavingsKG: true,
                  estimatedWaterSavingsLT: true,
                },
              },
            },
            orderBy: [{ isPrimary: "desc" }, { quantity: "desc" }],
          },
          _count: {
            select: {
              product: true,
            },
          },
        },
        orderBy: {
          productCategoryName: "asc",
        },
      });

      // Get total count of ALL products in this department category
      const totalProductsCount = await prisma.product.count({
        where: {
          productCategory: {
            departmentCategoryId: parsedId,
          },
          isActive: true,
          deletedAt: null,
        },
      });

      // Get paginated products for this department category (across all product categories)
      const products = await prisma.product.findMany({
        where: {
          productCategory: {
            departmentCategoryId: parsedId,
          },
          isActive: true,
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      });

      return {
        departmentCategory,
        productCategories,
        products: createPaginatedResponse(products, totalProductsCount, page, pageSize),
      };
    } catch (error) {
      console.error("Error al obtener las categorías de producto:", error);
      throw new ErrorService.InternalServerError("Error al obtener las categorías de producto.");
    }
  },

  getProductCategory: async ({ id, page = 1, pageSize = 20 }: { id: number; page?: number; pageSize?: number }) => {
    try {
      const parsedId = Number(id);
      const { skip, take } = calculatePrismaParams(page, pageSize);

      // Get product category with full hierarchy structure for breadcrumbs
      const productCategory = await prisma.productCategory.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          productCategoryName: true,
          departmentCategoryId: true,
          keywords: true,
          size: true,
          averageWeight: true,
          weightUnit: true,
          href: true,
          departmentCategory: {
            select: {
              id: true,
              departmentCategoryName: true,
              departmentId: true,
              href: true,
              department: {
                select: {
                  id: true,
                  departmentName: true,
                  departmentImage: true,
                  href: true,
                },
              },
            },
          },
          materials: {
            select: {
              id: true,
              productCategoryId: true,
              materialTypeId: true,
              quantity: true,
              unit: true,
              isPrimary: true,
              createdAt: true,
              updatedAt: true,
              material: {
                select: {
                  id: true,
                  materialType: true,
                  estimatedCo2SavingsKG: true,
                  estimatedWaterSavingsLT: true,
                },
              },
            },
            orderBy: [{ isPrimary: "desc" }, { quantity: "desc" }],
          },
        },
      });

      if (!productCategory) {
        throw new ErrorService.NotFoundError("Categoría de producto no encontrada.");
      }

      // Get total count of ALL products in this product category
      const totalProductsCount = await prisma.product.count({
        where: {
          productCategoryId: parsedId,
          isActive: true,
          deletedAt: null,
        },
      });

      // Get paginated products for this product category
      const products = await prisma.product.findMany({
        where: {
          productCategoryId: parsedId,
          isActive: true,
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      });

      // Return product category structure with paginated products
      return {
        ...productCategory,
        products: createPaginatedResponse(products, totalProductsCount, page, pageSize),
      };
    } catch (error) {
      console.error("Error al obtener la categoría de producto:", error);
      throw new ErrorService.InternalServerError("Error al obtener la categoría de producto.");
    }
  },
};
