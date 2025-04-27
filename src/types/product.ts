export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  hasOffer: boolean;
  offerPrice: number;
  stock: number;
  images: string[];
  categoryId: number;
  userId: string;
};
