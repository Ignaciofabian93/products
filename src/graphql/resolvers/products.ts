import { Context } from "../../types/context";
import { type Product } from "../../types/product";
import { ProductService } from "../services/product";

export const ProductResolver = {
  Query: {
    departments: (_parent: unknown, _args: unknown, context: Context) => ProductService.getProducts(context),
    department: (_parent: unknown, _args: { id: number }, context: Context) => ProductService.getProducts(context),
    departmentCategories: (_parent: unknown, _args: unknown, context: Context) => ProductService.getProducts(context),
    departmentCategory: (_parent: unknown, _args: { id: number }, context: Context) =>
      ProductService.getProducts(context),
    productCategories: (_parent: unknown, _args: unknown, context: Context) => ProductService.getProducts(context),
    productCategory: (_parent: unknown, _args: { id: number }, context: Context) => ProductService.getProducts(context),
    products: (_parent: unknown, _args: unknown, context: Context) => ProductService.getProducts(context),
    product: (_parent: unknown, _args: { id: number }, context: Context) => ProductService.getProduct(_args, context),
  },
  Mutation: {
    addProduct: (_parent: unknown, _args: Omit<Product, "id">, context: Context) =>
      ProductService.addProduct(_args, context),
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
