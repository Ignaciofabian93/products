import { Context } from "../../types/context";
import { type Product } from "../../types/product";
import { DepartmentCategoriesService } from "../services/departmentCategories";
import { DepartmentService } from "../services/departments";
import { ProductService } from "../services/product";
import { ProductCategoriesService } from "../services/productCategories";

export const ProductResolver = {
  Query: {
    departments: (_parent: unknown, _args: unknown) => DepartmentService.getDepartments(),
    department: (_parent: unknown, _args: { id: number }) => DepartmentService.getDepartment(_args),

    departmentCategoriesByDepartment: (_parent: unknown, _args: { id: number }) =>
      DepartmentCategoriesService.getDepartmentCategoriesByDepartment(_args),
    departmentCategories: (_parent: unknown, _args: unknown) => DepartmentCategoriesService.getDepartmentCategories(),
    departmentCategory: (_parent: unknown, _args: { id: number }) =>
      DepartmentCategoriesService.getDepartmentCategory(_args),

    productCategoriesByDepartmentCategory: (_parent: unknown, _args: { id: number }) =>
      ProductCategoriesService.getProductCategoriesByDepartmentCategory(_args),
    productCategories: (_parent: unknown, _args: unknown) => ProductCategoriesService.getProductCategories,
    productCategory: (_parent: unknown, _args: { id: number }) => ProductCategoriesService.getProductCategory(_args),

    products: (_parent: unknown, _args: unknown) => ProductService.getProducts(),
    product: (_parent: unknown, _args: { id: number }) => ProductService.getProduct(_args),
    productsByOwner: (_parent: unknown, _args: { id: string }) => ProductService.getProductsByOwner(_args),
  },
  Mutation: {
    addProduct: (_parent: unknown, _args: Omit<Product, "id">) => ProductService.addProduct(_args),
    updateProduct: (_parent: unknown, _args: Product, context: Context) => ProductService.updateProduct(_args, context),
    deleteProduct: (_parent: unknown, _args: { id: number }, context: Context) =>
      ProductService.deleteProduct(_args, context),
    stockControl: (_parent: unknown, _args: { id: number; operation: string; amount: number }, context: Context) =>
      ProductService.stockControl(_args, context),
  },
  Product: {
    user: (product: Product) => {
      return { __typename: "User", id: product.userId };
    },
  },
};
