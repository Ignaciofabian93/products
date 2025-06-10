export type ProductCategory = {
  id: number;
  productCategory: string;
  products: Product[];
};

export type DepartmentCategory = {
  id: number;
  departmentCategory: string;
  productCategories: ProductCategory[];
};

export type Department = {
  id: number;
  department: string;
  departmentCategories: DepartmentCategory[];
};

export type Product = {
  id: number;
  sku?: string | null;
  barcode?: string | null;
  color?: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  hasOffer: boolean;
  offerPrice: number;
  stock: number;
  isExchangeable: boolean;
  isActive: boolean;
  ratings?: number;
  ratingCount: number;
  reviewsNumber: number;
  userId: string;
  badges: (
    | "POPULAR"
    | "DISCOUNTED"
    | "WOMAN_OWNED"
    | "ECO_FRIENDLY"
    | "BEST_SELLER"
    | "TOP_RATED"
    | "COMMUNITY_FAVORITE"
    | "LIMITED_TIME_OFFER"
    | "FLASH_SALE"
    | "BEST_VALUE"
    | "HANDMADE"
    | "SUSTAINABLE"
    | "SUPPORTS_CAUSE"
    | "FAMILY_BUSINESS"
    | "CHARITY_SUPPORT"
    | "LIMITED_STOCK"
    | "SEASONAL"
    | "FREE_SHIPPING"
  )[];
  createdAt: Date;
  updatedAt?: Date;
  productCategoryId: number;
  likes?: Like[];
  comments?: Comment[];
  itemsOrdered?: ItemOrdered[];
};

export type Like = {
  id: number;
  userId: string;
  productId: number;
  createdAt: Date;
};

export type Comment = {
  id: number;
  userId: string;
  productId: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ItemOrdered = {
  id: number;
  productId: number;
  userId: string;
  quantity: number;
  orderId: string;
};
