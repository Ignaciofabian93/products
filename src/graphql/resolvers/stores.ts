import { PaginationInput } from "../../types/general";
import { StoreService } from "../services/store";

export const StoreResolver = {
  Query: {
    getStoreCategory: (_parent: unknown, _args: { id: number } & PaginationInput) =>
      StoreService.getStoreCategory({ ..._args }),
    getStoreCategories: (_parent: unknown, _args: unknown) => StoreService.getStoreCategories(),
    getStoreSubCategoriesByCategoryId: (_parent: unknown, _args: { storeCategoryId: number }) =>
      StoreService.getStoreSubCategoriesByCategoryId({ ..._args }),
  },
};
