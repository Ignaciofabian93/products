import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";

export const ImpactsService = {
  getCo2ImpactMessages: async ({ value }: { value: number }) => {
    try {
      let message = await prisma.co2ImpactMessage.findFirst({
        where: {
          min: { lte: value },
          max: { gte: value },
        },
      });

      if (!message) {
        // Try to find the nearest lower (floor)
        const lower = await prisma.co2ImpactMessage.findFirst({
          where: { min: { lte: value } },
          orderBy: { min: "desc" },
        });

        // Try to find the nearest higher (ceil)
        const higher = await prisma.co2ImpactMessage.findFirst({
          where: { min: { gt: value } },
          orderBy: { min: "asc" },
        });

        // Pick the closest by distance
        if (lower && higher) {
          message = Math.abs(value - lower.min) <= Math.abs(value - higher.min) ? lower : higher;
        } else {
          message = lower || higher;
        }
      }

      if (!message) {
        return new ErrorService.NotFoundError("No se ha encontrado una equivalencia al valor entregado.");
      }

      return message;
    } catch (error) {
      console.error("Error al obtener el mensaje de impacto de CO2:", error);
      return new ErrorService.InternalServerError("Error al obtener el mensaje de impacto de CO2");
    }
  },
  getWaterImpactMessages: async ({ value }: { value: number }) => {
    try {
      let message = await prisma.waterImpactMessage.findFirst({
        where: {
          min: { lte: value },
          max: { gte: value },
        },
      });

      if (!message) {
        // Try to find the nearest lower (floor)
        const lower = await prisma.waterImpactMessage.findFirst({
          where: { min: { lte: value } },
          orderBy: { min: "desc" },
        });

        // Try to find the nearest higher (ceil)
        const higher = await prisma.waterImpactMessage.findFirst({
          where: { min: { gt: value } },
          orderBy: { min: "asc" },
        });

        // Pick the closest by distance
        if (lower && higher) {
          message = Math.abs(value - lower.min) <= Math.abs(value - higher.min) ? lower : higher;
        } else {
          message = lower || higher;
        }
      }

      if (!message) {
        return new ErrorService.NotFoundError("No se ha encontrado una equivalencia al valor entregado.");
      }

      return message;
    } catch (error) {
      console.error("Error al obtener el mensaje de impacto de agua:", error);
      return new ErrorService.InternalServerError("Error al obtener el mensaje de impacto de agua");
    }
  },
};
