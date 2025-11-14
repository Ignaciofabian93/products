import { ImpactsService } from "../services/impacts";
import { MaterialImpactsService } from "../services/materialImpacts";

export const ImpactResolver = {
  Query: {
    // Legacy single value queries (for backward compatibility)
    co2ImpactMessages: (_parent: unknown, args: { value: number }) => ImpactsService.getCo2ImpactMessages(args),
    waterImpactMessages: (_parent: unknown, args: { value: number }) => ImpactsService.getWaterImpactMessages(args),

    // New list queries
    getMaterialImpacts: () => MaterialImpactsService.getMaterialImpacts(),
    getCo2ImpactMessages: () => MaterialImpactsService.getAllCo2ImpactMessages(),
    getWaterImpactMessages: () => MaterialImpactsService.getAllWaterImpactMessages(),
    calculateProductImpact: (_parent: unknown, args: { productCategoryId: string }) =>
      MaterialImpactsService.calculateCategoryImpact(Number(args.productCategoryId)),
  },
};
