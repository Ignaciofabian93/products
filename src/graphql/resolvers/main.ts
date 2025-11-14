import { CatalogResolver } from "./catalog";
import { ImpactResolver } from "./impact";
import { MarketplaceResolver } from "./marketplace";
import { ProductResolver } from "./product";
// import { StoreProductResolver } from "./storeProduct";
import { StoreResolver } from "./stores";

export const MainResolver = {
  Query: {
    ...CatalogResolver.Query,
    ...ProductResolver.Query,
    ...ImpactResolver.Query,
    ...MarketplaceResolver.Query,
    ...StoreResolver.Query,
  },
  // Mutation: {
  //   ...ProductResolver.Mutation,
  //   ...StoreProductResolver.Mutation,
  // },
  // Product: {
  //   ...ProductResolver.Product,
  // },
};
