import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { ProductCategoryMaterial } from "../../types/product";

export const MaterialImpactsService = {
  /**
   * Get all material impact estimates
   * Used to display available materials and their environmental impact
   */
  getMaterialImpacts: async () => {
    try {
      const materials = await prisma.materialImpactEstimate.findMany({
        select: {
          id: true,
          materialType: true,
          estimatedCo2SavingsKG: true,
          estimatedWaterSavingsLT: true,
        },
        orderBy: {
          materialType: "asc",
        },
      });

      if (!materials.length) {
        throw new ErrorService.NotFoundError("No se encontraron materiales con datos de impacto.");
      }

      return materials;
    } catch (error) {
      console.error("Error al obtener los datos de impacto de materiales:", error);
      throw new ErrorService.InternalServerError("Error al obtener los datos de impacto de materiales");
    }
  },

  /**
   * Get all CO2 impact messages
   * Returns all available CO2 impact message ranges
   */
  getAllCo2ImpactMessages: async () => {
    try {
      const messages = await prisma.co2ImpactMessage.findMany({
        orderBy: {
          min: "asc",
        },
      });

      if (!messages.length) {
        throw new ErrorService.NotFoundError("No se encontraron mensajes de impacto de CO2.");
      }

      return messages;
    } catch (error) {
      console.error("Error al obtener los mensajes de impacto de CO2:", error);
      throw new ErrorService.InternalServerError("Error al obtener los mensajes de impacto de CO2");
    }
  },

  /**
   * Get all water impact messages
   * Returns all available water impact message ranges
   */
  getAllWaterImpactMessages: async () => {
    try {
      const messages = await prisma.waterImpactMessage.findMany({
        orderBy: {
          min: "asc",
        },
      });

      if (!messages.length) {
        throw new ErrorService.NotFoundError("No se encontraron mensajes de impacto de agua.");
      }

      return messages;
    } catch (error) {
      console.error("Error al obtener los mensajes de impacto de agua:", error);
      throw new ErrorService.InternalServerError("Error al obtener los mensajes de impacto de agua");
    }
  },

  /**
   * Calculate environmental impact for a specific product category
   * Uses the category's materials and average weight to estimate CO2 and water savings
   */
  calculateCategoryImpact: async (productCategoryId: number) => {
    try {
      const category = await prisma.productCategory.findUnique({
        where: { id: productCategoryId },
        include: {
          materials: {
            include: {
              material: true,
            },
          },
        },
      });

      if (!category) {
        throw new ErrorService.NotFoundError("Categoría de producto no encontrada.");
      }

      if (!category.materials.length) {
        return {
          totalCo2SavingsKG: 0,
          totalWaterSavingsLT: 0,
          materialBreakdown: [],
        };
      }

      const averageWeight = category.averageWeight || 0;
      let totalCo2SavingsKG = 0;
      let totalWaterSavingsLT = 0;

      const materialBreakdown = category.materials.map((mat: ProductCategoryMaterial) => {
        // Calculate weight of this material in the product
        const materialWeightKG = mat.unit === "percentage" ? (averageWeight * mat.quantity) / 100 : mat.quantity;

        // Calculate savings for this material
        const co2SavingsKG = materialWeightKG * mat.material.estimatedCo2SavingsKG;
        const waterSavingsLT = materialWeightKG * mat.material.estimatedWaterSavingsLT;

        totalCo2SavingsKG += co2SavingsKG;
        totalWaterSavingsLT += waterSavingsLT;

        return {
          materialType: mat.material.materialType,
          percentage: mat.unit === "percentage" ? mat.quantity : (mat.quantity / averageWeight) * 100,
          weightKG: materialWeightKG,
          co2SavingsKG,
          waterSavingsLT,
        };
      });

      return {
        totalCo2SavingsKG: parseFloat(totalCo2SavingsKG.toFixed(2)),
        totalWaterSavingsLT: parseFloat(totalWaterSavingsLT.toFixed(2)),
        materialBreakdown,
      };
    } catch (error) {
      console.error("Error al calcular el impacto ambiental:", error);
      if (error instanceof ErrorService.NotFoundError) {
        throw error;
      }
      throw new ErrorService.InternalServerError("Error al calcular el impacto ambiental");
    }
  },
};
