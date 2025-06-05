import { ProductResolver } from "./products";

export const resolvers = {
  Query: {
    ...ProductResolver.Query,
  },
  Mutation: {
    ...ProductResolver.Mutation,
  },
  Product: {
    __resolveReference: ProductResolver.Product.__resolveReference,
  },
  ProductCategory: {
    __resolveReference: ProductResolver.ProductCategory.__resolveReference,
  },
  DepartmentCategory: {
    __resolveReference: ProductResolver.DepartmentCategory.__resolveReference,
  },
  Department: {
    __resolveReference: ProductResolver.Department.__resolveReference,
  },
};
