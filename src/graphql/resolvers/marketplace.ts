import { Context } from "../../types/context";
import { PaginationInput } from "../../types/general";
import { MarketplaceService } from "../services/marketplace";

export const MarketplaceResolver = {
  Query: {
    getDepartments: (_parent: unknown, _args: unknown, context: Context) =>
      MarketplaceService.getDepartments({ ...context }),
    getDepartmentCategoriesByDepartmentId: (_parent: unknown, _args: { departmentId: number }, context: Context) =>
      MarketplaceService.getDepartmentCategoriesByDepartmentId({ ..._args, ...context }),
    getProductCategoriesByDepartmentCategoryId: (
      _parent: unknown,
      _args: { departmentCategoryId: number },
      context: Context,
    ) => MarketplaceService.getProductCategoriesByDepartmentCategoryId({ ..._args, ...context }),

    getDepartment: (_parent: unknown, _args: { id: number } & PaginationInput) =>
      MarketplaceService.getDepartment({ ..._args }),
    getDepartmentCategories: (_parent: unknown, args: { departmentId: string; page?: number; pageSize?: number }) =>
      MarketplaceService.getDepartmentCategories({
        departmentId: Number(args.departmentId),
        page: args.page,
        pageSize: args.pageSize,
      }),
    getDepartmentCategory: (_parent: unknown, _args: { id: number } & PaginationInput) =>
      MarketplaceService.getDepartmentCategory({ ..._args }),
    getProductCategory: (_parent: unknown, args: { id: string; page?: number; pageSize?: number }) =>
      MarketplaceService.getProductCategory({ id: Number(args.id), page: args.page, pageSize: args.pageSize }),
    getProductCategories: (
      _parent: unknown,
      args: { departmentCategoryId: string; page?: number; pageSize?: number },
    ) =>
      MarketplaceService.getProductCategories({
        departmentCategoryId: Number(args.departmentCategoryId),
        page: args.page,
        pageSize: args.pageSize,
      }),
  },
};
