export type ProductLike = {
  id: number;
  productId: number;
  sellerId: string;
};

export type ProductComment = {
  id: number;
  comment: string;
  productId: number;
  sellerId: string;
  createdAt: Date;
  rating?: number | null;
};
