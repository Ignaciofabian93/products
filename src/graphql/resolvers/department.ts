import { DepartmentService } from "../services/departments";
import { DepartmentCategoriesService } from "../services/departmentCategories";
import { ProductCategoriesService } from "../services/productCategories";

export const DepartmentResolver = {
  Query: {
    getDepartment: (_parent: unknown, args: { id: string; page?: number; pageSize?: number }) =>
      DepartmentService.getDepartment({ id: Number(args.id), page: args.page, pageSize: args.pageSize }),

    getDepartmentCategories: (_parent: unknown, args: { departmentId: string; page?: number; pageSize?: number }) =>
      DepartmentCategoriesService.getDepartmentCategories({
        departmentId: Number(args.departmentId),
        page: args.page,
        pageSize: args.pageSize,
      }),

    getProductCategory: (_parent: unknown, args: { id: string; page?: number; pageSize?: number }) =>
      ProductCategoriesService.getProductCategory({ id: Number(args.id), page: args.page, pageSize: args.pageSize }),

    getProductCategories: (_parent: unknown, args: { departmentCategoryId: string; page?: number; pageSize?: number }) =>
      ProductCategoriesService.getProductCategories({
        departmentCategoryId: Number(args.departmentCategoryId),
        page: args.page,
        pageSize: args.pageSize,
      }),
  },
};
