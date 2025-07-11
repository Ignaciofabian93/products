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
          departmentCategories: {
            select: {
              id: true,
              departmentCategoryName: true,
              productCategories: {
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
};
