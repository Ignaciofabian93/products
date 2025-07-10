import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type OrderBy } from "../../types/general";
import { type Product } from "../../types/product";
import { userSelect, productCategorySelect, commentSelect, likeSelect } from "./selects/products";

export const ProductService = {
  getProducts: async ({ take = 20, skip = 0, orderBy }: { take: number; skip: number; orderBy: OrderBy }) => {
    const { field = "name", direction = "asc" } = orderBy || {};
    const orderByClause = { [field]: direction };
    const products: Product[] = await prisma.product.findMany({
      select: {
        id: true,
        sku: true,
        barcode: true,
        color: true,
        brand: true,
        name: true,
        description: true,
        price: true,
        images: true,
        hasOffer: true,
        offerPrice: true,
        stock: true,
        isExchangeable: true,
        ratingCount: true,
        reviewsNumber: true,
        badges: true,
        interests: true,
        isActive: true,
        ratings: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        productCategoryId: true,
        user: { select: userSelect },
        productCategory: { select: productCategorySelect },
        comments: { select: commentSelect },
        likes: { select: likeSelect },
      },
      orderBy: orderByClause,
      take,
      skip,
    });

    if (!products) {
      return new ErrorService.NotFoundError("No se encontraron productos");
    }

    return products;
  },
  getProduct: async ({ id }: { id: number }) => {
    const product: Product | null = await prisma.product.findUnique({
      select: {
        id: true,
        sku: true,
        barcode: true,
        color: true,
        brand: true,
        name: true,
        description: true,
        price: true,
        images: true,
        hasOffer: true,
        offerPrice: true,
        stock: true,
        isExchangeable: true,
        ratingCount: true,
        reviewsNumber: true,
        badges: true,
        interests: true,
        isActive: true,
        ratings: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        productCategoryId: true,
        user: { select: userSelect },
        productCategory: { select: productCategorySelect },
        comments: { select: commentSelect },
        likes: { select: likeSelect },
      },
      where: { id: Number(id) },
    });

    if (!product) {
      return new ErrorService.NotFoundError("Producto no encontrado");
    }

    return product;
  },
  getProductsByOwner: async ({
    id,
    take = 20,
    skip = 0,
    orderBy,
  }: {
    id: string;
    take: number;
    skip: number;
    orderBy: OrderBy;
  }) => {
    try {
      const { field = "name", direction = "asc" } = orderBy || {};
      const orderByClause = { [field]: direction };
      const products: Product[] = await prisma.product.findMany({
        select: {
          id: true,
          sku: true,
          barcode: true,
          color: true,
          brand: true,
          name: true,
          description: true,
          price: true,
          images: true,
          hasOffer: true,
          offerPrice: true,
          stock: true,
          isExchangeable: true,
          ratingCount: true,
          reviewsNumber: true,
          badges: true,
          interests: true,
          isActive: true,
          ratings: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          productCategoryId: true,
          user: { select: userSelect },
          productCategory: { select: productCategorySelect },
          comments: { select: commentSelect },
          likes: { select: likeSelect },
        },
        orderBy: orderByClause,
        take,
        skip,
        where: { userId: id },
      });

      if (!products) {
        return new ErrorService.NotFoundError("No se encontraron productos");
      }

      return products;
    } catch (error) {
      console.error("Error al obtener los productos del propietario:", error);
      return new ErrorService.InternalServerError("Error al obtener los productos del propietario");
    }
  },
  getFeedProducts: async ({
    take = 20,
    scope = "MARKET",
    exchange,
  }: {
    take?: number;
    scope: "MARKET" | "STORE";
    exchange: boolean;
  }) => {
    const isCompany = scope === "STORE";
    const products = await prisma.product.findMany({
      select: {
        id: true,
        sku: true,
        barcode: true,
        color: true,
        brand: true,
        name: true,
        description: true,
        price: true,
        images: true,
        hasOffer: true,
        offerPrice: true,
        stock: true,
        isExchangeable: true,
        ratingCount: true,
        reviewsNumber: true,
        badges: true,
        interests: true,
        isActive: true,
        ratings: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        productCategoryId: true,
        user: { select: userSelect },
        productCategory: { select: productCategorySelect },
        comments: { select: commentSelect },
        likes: { select: likeSelect },
      },
      where: {
        isActive: true,
        isExchangeable: exchange,
        user: { isCompany },
      },
      take,
      orderBy: { createdAt: "desc" },
    });

    if (!products) {
      return new ErrorService.NotFoundError("No se encontraron productos");
    }

    return products;
  },
  getMyFavorites: async ({ userId }: { userId: string }) => {
    const products: Product[] = await prisma.product.findMany({
      select: {
        id: true,
        sku: true,
        barcode: true,
        color: true,
        brand: true,
        name: true,
        description: true,
        price: true,
        images: true,
        hasOffer: true,
        offerPrice: true,
        stock: true,
        isExchangeable: true,
        ratingCount: true,
        reviewsNumber: true,
        badges: true,
        interests: true,
        isActive: true,
        ratings: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        productCategoryId: true,
        user: { select: userSelect },
        productCategory: { select: productCategorySelect },
        comments: { select: commentSelect },
        likes: { select: likeSelect },
      },
      where: {
        likes: { some: { userId } },
      },
    });

    if (!products) {
      return new ErrorService.NotFoundError("No se encontraron productos");
    }

    return products;
  },
  addProduct: async ({
    sku,
    barcode,
    color,
    brand,
    name,
    description,
    price,
    images,
    hasOffer,
    offerPrice,
    stock,
    isExchangeable,
    interests,
    isActive,
    userId,
    badges,
    productCategoryId,
  }: Omit<Product, "id">) => {
    const product: Product = await prisma.product.create({
      data: {
        sku: sku || null,
        barcode: barcode || null,
        color: color || null,
        brand,
        name,
        description,
        price,
        hasOffer,
        offerPrice,
        stock,
        isActive,
        isExchangeable,
        badges,
        images,
        userId,
        interests: interests || [],
        productCategoryId,
      },
    });
    if (!product) {
      return new ErrorService.InternalServerError("Error al crear el producto");
    }

    return product;
  },
  updateProduct: async ({
    id,
    sku,
    barcode,
    color,
    brand,
    name,
    description,
    price,
    hasOffer,
    offerPrice,
    stock,
    isActive,
    isExchangeable,
    badges,
    images,
    userId,
    productCategoryId,
  }: Product) => {
    const product: Product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        sku: sku || null,
        barcode: barcode || null,
        color: color || null,
        brand,
        name,
        description,
        price,
        hasOffer,
        offerPrice,
        stock,
        isActive,
        isExchangeable,
        badges,
        images,
        userId,
        productCategoryId,
      },
    });

    if (!product) {
      return new ErrorService.InternalServerError("Error al actualizar el producto");
    }

    return product;
  },
  deleteProduct: async ({ id }: { id: number }) => {
    const product: Product = await prisma.product.delete({
      where: { id: Number(id) },
    });

    if (!product) {
      return new ErrorService.InternalServerError("Error al eliminar el producto");
    }

    return product;
  },
  stockControl: async ({ id, operation, quantity }: { id: number; quantity: number; operation: string }) => {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return new ErrorService.NotFoundError("Producto no encontrado");
    }

    if (operation === "add") {
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          stock: product.stock + quantity,
        },
      });

      return updatedProduct;
    } else if (operation === "subtract") {
      if (product.stock < quantity) {
        return new ErrorService.BadRequestError("No hay suficiente stock");
      }

      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          stock: product.stock - quantity,
        },
      });

      return updatedProduct;
    } else {
      return new ErrorService.BadRequestError("Operación no válida");
    }
  },
  likeProduct: async ({ id, userId }: { id: number; userId: string }) => {
    console.log("Liking product with ID:", id, "by user:", userId);

    const productLike = await prisma.productLike.create({
      data: {
        productId: Number(id),
        userId,
      },
    });

    if (!productLike) {
      return new ErrorService.InternalServerError("Error al dar like al producto");
    }

    return productLike;
  },
  unlikeProduct: async ({ id, userId }: { id: number; userId: string }) => {
    const productLike = await prisma.productLike.delete({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!productLike) {
      return new ErrorService.InternalServerError("Error al quitar like al producto");
    }

    return true;
  },
  toggleLikeProduct: async ({ id, userId }: { id: number; userId: string }) => {
    // Check if the like already exists
    const existingLike = await prisma.productLike.findFirst({
      where: {
        productId: Number(id),
        userId,
      },
    });

    if (existingLike) {
      // Unlike (remove the like)
      await prisma.productLike.delete({
        where: { id: existingLike.id },
      });
    } else {
      // Like (create the like)
      await prisma.productLike.create({
        data: {
          productId: Number(id),
          userId,
        },
      });
    }

    // Return the updated product with likes
    return ProductService.getProduct({ id: Number(id) });
  },
};
