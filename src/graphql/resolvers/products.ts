import { Context } from "../../types/context";
import { ProductService } from "../services/product";

export const ProductResolver = {
  Query: {
    products: () => ProductService.getProducts(),
    product: (_parent: unknown, _args: unknown, context: Context) => ProductService.getProduct(context),
  },
  Mutation: {
    addProduct: () => ProductService.addProduct(),
    updateProduct: () => ProductService.updateProduct(),
    deleteProduct: () => ProductService.deleteProduct(),
    stockControl: () => ProductService.stockControl(),
  },
};
