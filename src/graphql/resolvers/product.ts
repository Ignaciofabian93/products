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
    getProduct: (_parent: unknown, args: { id: string }) => ProductService.getProduct({ id: Number(args.id) }),
    getProducts: (_parent: unknown, args: PaginationArgs) => ProductService.getProducts({ ...args }),
    getProductsBySeller: (_parent: unknown, args: { sellerId: string } & PaginationArgs) =>
      ProductService.getProductsByOwner({ ...args }),
  },
  Mutation: {
    // TODO: Fix these mutations - they need context
    // addProduct: (_parent: unknown, args: { input: AddProductInput }) => ProductService.addProduct(args),
    // updateProduct: (_parent: unknown, args: { input: UpdateProductInput }) => ProductService.updateProduct(args),
    deleteProduct: (_parent: unknown, args: { id: string }) => ProductService.deleteProduct({ id: Number(args.id) }),
  },
};
