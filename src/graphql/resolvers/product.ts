import { Context } from "../../types/context";
import { type Badge, type ProductCondition } from "../../types/enums";
import { DepartmentCategoriesService } from "../services/departmentCategories";
import { DepartmentService } from "../services/departments";
import { ProductService } from "../services/product";
import { ProductCategoriesService } from "../services/productCategories";

export type AddProductInput = {
  sku: string;
  barcode: string;
  color: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  hasOffer: boolean;
  offerPrice: number;
  stock: number;
  isExchangeable: boolean;
  interests: string[];
  isActive: boolean;
  badges: Badge[];
  productCategoryId: number;
  sellerId: string;
  condition: ProductCondition;
  conditionDescription: string;
  sustainabilityScore: number;
  materialComposition: string;
  recycledContent: number;
};

export type UpdateProductInput = {
  id: string;
  sku: string;
  barcode: string;
  color: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  hasOffer: boolean;
  offerPrice: number;
  stock: number;
  isExchangeable: boolean;
  interests: string[];
  isActive: boolean;
  badges: Badge[];
  productCategoryId: number;
  condition: ProductCondition;
  conditionDescription: string;
  sustainabilityScore: number;
  materialComposition: string;
  recycledContent: number;
};

export type PaginationArgs = {
  take: number;
  skip: number;
  orderBy?: { field: string; direction: "asc" | "desc" };
};

export type FeedProductsArgs = {
  isExchangeable: boolean;
  take: number;
  orderBy: { field: string; direction: "asc" | "desc" };
  scope: "MARKET" | "STORE";
};

export const ProductResolver = {
  Query: {
    departments: (_parent: unknown, _args: PaginationArgs) => DepartmentService.getDepartments({ ..._args }),
    department: (_parent: unknown, _args: { departmentId: number }) => DepartmentService.getDepartment({ ..._args }),
    productsByDepartment: (_parent: unknown, _args: { departmentId: number } & PaginationArgs) =>
      DepartmentService.getProductsByDepartment({ ..._args, ...context }),

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

    products: (_parent: unknown, _args: PaginationArgs) => ProductService.getProducts({ ..._args }),
    product: (_parent: unknown, _args: { id: number }) => ProductService.getProduct(_args),
    productsByOwner: (_parent: unknown, _args: { sellerId: string } & PaginationArgs) =>
      ProductService.getProductsByOwner({ ..._args }),

    feedProducts: (_parent: unknown, _args: FeedProductsArgs & Context) => ProductService.getFeedProducts({ ..._args }),
    myFavorites: (_parent: unknown, _args: { userId: string }) => ProductService.getMyFavorites({ ..._args }),
    myProducts: (_parent: unknown, _args: { userId: string; take: number; skip: number; orderBy: OrderBy }) =>
      ProductService.getMyProducts({ ..._args }),
  },
  Mutation: {
    addProduct: (_parent: unknown, _args: { input: AddProductInput }, context: Context) =>
      ProductService.addProduct(_args),
    updateProduct: (_parent: unknown, _args: { input: UpdateProductInput }, context: Context) =>
      ProductService.updateProduct(_args),
    deleteProduct: (_parent: unknown, _args: { id: number }) => ProductService.deleteProduct(_args),
    likeProduct: (_parent: unknown, _args: { id: number; sellerId: string }) => ProductService.toggleLikeProduct(_args),
  },
};
