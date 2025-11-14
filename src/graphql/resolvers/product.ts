import { Context } from "../../types/context";
import { type Badge, type ProductCondition } from "../../types/enums";
import { ProductService } from "../services/product";
import { MaterialImpactsService } from "../services/materialImpacts";

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
  page?: number;
  pageSize?: number;
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
    getProducts: (_parent: unknown, args: { page?: number; pageSize?: number; isActive?: boolean }) =>
      ProductService.getProducts(args),
    getProductsBySeller: (
      _parent: unknown,
      args: { sellerId: string; page?: number; pageSize?: number; isActive?: boolean },
    ) => ProductService.getProductsByOwner(args),
    getProductsByCategory: (
      _parent: unknown,
      args: { productCategoryId: string; page?: number; pageSize?: number; isActive?: boolean },
    ) =>
      ProductService.getProductsByCategory({
        productCategoryId: Number(args.productCategoryId),
        page: args.page,
        pageSize: args.pageSize,
        isActive: args.isActive,
      }),
    getExchangeableProducts: (_parent: unknown, args: { page?: number; pageSize?: number }) =>
      ProductService.getExchangeableProducts(args),
  },
  Mutation: {
    addProduct: (_parent: unknown, args: { input: AddProductInput }, context: Context) =>
      ProductService.addProduct({ input: args.input, sellerId: context.sellerId }),
    updateProduct: (_parent: unknown, args: { input: UpdateProductInput }, context: Context) =>
      ProductService.updateProduct({ input: args.input, sellerId: context.sellerId }),
    deleteProduct: (_parent: unknown, args: { id: string }) => ProductService.deleteProduct({ id: Number(args.id) }),
    toggleProductActive: (_parent: unknown, args: { id: string }, context: Context) =>
      ProductService.toggleProductActive({ id: Number(args.id), sellerId: context.sellerId }),
  },
  Product: {
    // Resolve productCategory relationship
    productCategory: async (parent: { productCategoryId: number }) => {
      try {
        // return await ProductCategoriesService.getProductCategory({ id: parent.productCategoryId });
      } catch (error) {
        console.error("Error resolving productCategory:", error);
        return null;
      }
    },
    // Resolve seller relationship (federated)
    seller: (parent: { sellerId: string }) => {
      return { __typename: "Seller", id: parent.sellerId };
    },
    // Calculate environmental impact
    environmentalImpact: async (parent: { productCategoryId: number }) => {
      try {
        return await MaterialImpactsService.calculateCategoryImpact(parent.productCategoryId);
      } catch (error) {
        console.error("Error calculating environmental impact:", error);
        return null;
      }
    },
  },
};
