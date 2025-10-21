import { type OrderBy } from "../../types/general";
import { DepartmentCategoriesService } from "../services/departmentCategories";
import { DepartmentService } from "../services/departments";
import { ProductService } from "../services/product";
import { ProductCategoriesService } from "../services/productCategories";
import { CatalogResolver } from "./catalog";
import { ImpactResolver } from "./impact";
import { ProductResolver } from "./product";

type singleArgs = { id: number; take: number; skip: number; orderBy: OrderBy };

export const MainResolver = {
  Query: {
    ...CatalogResolver.Query,
    ...ProductResolver.Query,
    ...ImpactResolver.Query,
  },
  Mutation: {
    ...ProductResolver.Mutation,
  },
  Product: {
    __resolveReference: (reference: singleArgs) => ProductService.getProduct(reference),
  },
  ProductCategory: {
    __resolveReference: (reference: singleArgs) => ProductCategoriesService.getProductCategory(reference),
  },
  DepartmentCategory: {
    __resolveReference: (reference: singleArgs) => DepartmentCategoriesService.getDepartmentCategory(reference),
  },
  Department: {
    __resolveReference: (reference: singleArgs) => DepartmentService.getDepartment(reference),
  },
  ProductLike: {
    user: (parent: { userId: string }) => ({ __typename: "User", id: parent.userId }),
  },
  ProductComment: {
    user: (parent: { userId: string }) => ({ __typename: "User", id: parent.userId }),
  },
};
