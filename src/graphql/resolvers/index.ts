import { MainResolver } from "./main";

export const resolvers = {
  Query: {
    ...MainResolver.Query,
  },
  Mutation: {
    ...MainResolver.Mutation,
  },
  // Product: {
  //   __resolveReference: MainResolver.Product.__resolveReference,
  // },
  // ProductCategory: {
  //   __resolveReference: MainResolver.ProductCategory.__resolveReference,
  // },
  // DepartmentCategory: {
  //   __resolveReference: MainResolver.DepartmentCategory.__resolveReference,
  // },
  // Department: {
  //   __resolveReference: MainResolver.Department.__resolveReference,
  // },
};
