import { type OrderBy } from "../../types/general";
import { type Product } from "../../types/product";
import { CatalogService } from "../services/catalog";
import { DepartmentCategoriesService } from "../services/departmentCategories";
import { DepartmentService } from "../services/departments";
import { ImpactsService } from "../services/impacts";
import { ProductService } from "../services/product";
import { ProductCategoriesService } from "../services/productCategories";

type pluralArgs = { take: number; skip: number; orderBy: OrderBy };
type singleArgs = { id: number; take: number; skip: number; orderBy: OrderBy };

export const ProductResolver = {
  Query: {
    marketCatalog: (_parent: unknown, _args: unknown) => CatalogService.getMarketCatalog(),

    departments: (_parent: unknown, _args: pluralArgs) => DepartmentService.getDepartments(_args),
    department: (_parent: unknown, _args: singleArgs) => DepartmentService.getDepartment(_args),
    productsByDepartment: (_parent: unknown, _args: { departmentId: number; take: number }) =>
      DepartmentService.getProductsByDepartment(_args),

    departmentCategoriesByDepartment: (_parent: unknown, _args: singleArgs) =>
      DepartmentCategoriesService.getDepartmentCategoriesByDepartment(_args),
    departmentCategories: (_parent: unknown, _args: pluralArgs) =>
      DepartmentCategoriesService.getDepartmentCategories(_args),
    departmentCategory: (_parent: unknown, _args: singleArgs) =>
      DepartmentCategoriesService.getDepartmentCategory(_args),
    productsByDepartmentCategory: (_parent: unknown, _args: { departmentCategoryId: number; take: number }) =>
      DepartmentCategoriesService.getProductsByDepartmentCategory(_args),

    productCategoriesByDepartmentCategory: (_parent: unknown, _args: singleArgs) =>
      ProductCategoriesService.getProductCategoriesByDepartmentCategory(_args),
    productCategories: (_parent: unknown, _args: pluralArgs) => ProductCategoriesService.getProductCategories(_args),
    productCategory: (_parent: unknown, _args: singleArgs) => ProductCategoriesService.getProductCategory(_args),

    productsByProductCategory: (_parent: unknown, _args: { productCategoryId: number; take: number }) =>
      ProductCategoriesService.getProductsByProductCategory(_args),
    products: (_parent: unknown, _args: pluralArgs) => ProductService.getProducts(_args),
    product: (_parent: unknown, _args: singleArgs) => ProductService.getProduct(_args),

    feedProducts: (
      _parent: unknown,
      _args: { userId: string; isExchangeable: boolean; take: number; orderBy: OrderBy; scope: "MARKET" | "STORE" },
    ) => ProductService.getFeedProducts({ ..._args }),
    myFavorites: (_parent: unknown, _args: { userId: string }) => ProductService.getMyFavorites({ ..._args }),
    myProducts: (_parent: unknown, _args: { userId: string; take: number; skip: number; orderBy: OrderBy }) =>
      ProductService.getMyProducts({ ..._args }),

    co2ImpactMessages: (_parent: unknown, _args: { value: number }) => ImpactsService.getCo2ImpactMessages(_args),
    waterImpactMessages: (_parent: unknown, _args: { value: number }) => ImpactsService.getWaterImpactMessages(_args),
  },
  Mutation: {
    addProduct: (_parent: unknown, _args: Omit<Product, "id">) => ProductService.addProduct(_args),
    updateProduct: (_parent: unknown, _args: Product) => ProductService.updateProduct(_args),
    deleteProduct: (_parent: unknown, _args: { id: number }) => ProductService.deleteProduct(_args),
    likeProduct: (_parent: unknown, _args: { id: number; userId: string }) => ProductService.toggleLikeProduct(_args),
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
