import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type Department } from "../../types/product";

export const CatalogService = {
  getMarketCatalog: async () => {
    try {
      const departments: Department[] = await prisma.department.findMany({
        select: {
          id: true,
          departmentName: true,
          departmentCategory: {
            select: {
              id: true,
              departmentCategoryName: true,
              productCategory: {
                select: {
                  id: true,
                  productCategoryName: true,
                },
              },
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
      console.error("Error al obtener el catálogo del mercado:", error);
      return new ErrorService.InternalServerError("Error al obtener el catálogo del mercado");
    }
  },

  getStoreCatalog: async () => {
    try {
      const storeCatalog = await prisma.storeCategory.findMany({
        select: {
          id: true,
          category: true,
          subcategories: {
            select: {
              id: true,
              subCategory: true,
            },
          },
        },
        orderBy: {
          category: "asc",
        },
      });
      console.log("store catalog:: ", storeCatalog);

      if (!storeCatalog.length) {
        return new ErrorService.NotFoundError("No se encontraron categorías de tienda");
      }

      return storeCatalog;
    } catch (error) {
      console.error("Error al obtener el catálogo de tiendas:", error);
      return new ErrorService.InternalServerError("Error al obtener el catálogo de tiendas");
    }
  },
};
