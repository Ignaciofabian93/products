import { CatalogService } from "../services/catalog";

export const CatalogResolver = {
  Query: {
    marketCatalog: (_parent: unknown, _args: unknown) => CatalogService.getMarketCatalog(),
  },
};
