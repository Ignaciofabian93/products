import { StoreProductService } from "../services/storeProduct";

export const StoreProductResolver = {
  Query: {
    // Store queries - returns category with subcategories and products
    getStoreCategory: (_parent: unknown, args: { id: string; page?: number; pageSize?: number }) =>
      StoreProductService.getStoreCategory({ id: Number(args.id), page: args.page, pageSize: args.pageSize }),

    // Get paginated subcategories for a store category
    getStoreSubCategories: (_parent: unknown, args: { storeCategoryId: string; page?: number; pageSize?: number }) =>
      StoreProductService.getStoreSubCategories({
        storeCategoryId: Number(args.storeCategoryId),
        page: args.page,
        pageSize: args.pageSize,
      }),

    // Get single subcategory with breadcrumb and products
    getStoreSubCategory: (_parent: unknown, args: { id: string; page?: number; pageSize?: number }) =>
      StoreProductService.getStoreSubCategory({ id: Number(args.id), page: args.page, pageSize: args.pageSize }),

    // StoreProduct queries
    getStoreProducts: (_parent: unknown, args: { page?: number; pageSize?: number; isActive?: boolean }) =>
      StoreProductService.getStoreProducts({ page: args.page, pageSize: args.pageSize, isActive: args.isActive }),

    getStoreProduct: (_parent: unknown, args: { id: string }) =>
      StoreProductService.getStoreProduct({ id: Number(args.id) }),

    getStoreProductsBySeller: (
      _parent: unknown,
      args: { sellerId: string; page?: number; pageSize?: number; isActive?: boolean },
    ) =>
      StoreProductService.getStoreProductsBySeller({
        sellerId: args.sellerId,
        page: args.page,
        pageSize: args.pageSize,
        isActive: args.isActive,
      }),

    getStoreProductsBySubCategory: (
      _parent: unknown,
      args: { subcategoryId: string; page?: number; pageSize?: number; isActive?: boolean },
    ) =>
      StoreProductService.getStoreProductsBySubCategory({
        subcategoryId: Number(args.subcategoryId),
        page: args.page,
        pageSize: args.pageSize,
        isActive: args.isActive,
      }),
  },
  Mutation: {
    addStoreProduct: () => {},
    updateStoreProduct: () => {},
    deleteStoreProduct: () => {},
    toggleStoreProductActive: () => {},
  },
};
