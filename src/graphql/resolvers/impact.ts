import { ImpactsService } from "../services/impacts";

export const ImpactResolver = {
  Query: {
    co2ImpactMessages: (_parent: unknown, _args: { value: number }) => ImpactsService.getCo2ImpactMessages(_args),
    waterImpactMessages: (_parent: unknown, _args: { value: number }) => ImpactsService.getWaterImpactMessages(_args),
  },
};
