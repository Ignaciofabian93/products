import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type OrderBy } from "../../types/general";
import { type Product } from "../../types/product";

export const ProductService = {
  getProducts: async ({ take = 20, skip = 0, orderBy }: { take: number; skip: number; orderBy: OrderBy }) => {
    const { field = "name", direction = "asc" } = orderBy || {};
    const orderByClause = {
      [field]: direction,
    };
    const products: Product[] = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            surnames: true,
            profileImage: true,
            isCompany: true,
            businessName: true,
            phone: true,
            address: true,
            county: {
              select: {
                id: true,
                county: true,
              },
            },
            city: {
              select: {
                id: true,
                city: true,
              },
            },
            region: {
              select: {
                id: true,
                region: true,
              },
            },
          },
        },
        productCategory: {
          select: {
            id: true,
            productCategoryName: true,
            departmentCategoryId: true,
            keywords: true,
            materialImpactEstimateId: true,
            size: true,
            minWeight: true,
            maxWeight: true,
            weightUnit: true,
            departmentCategory: {
              select: {
                id: true,
                departmentCategoryName: true,
                departmentId: true,
                department: {
                  select: {
                    id: true,
                    departmentName: true,
                  },
                },
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            comment: true,
            user: {
              select: {
                id: true,
                name: true,
                businessName: true,
              },
            },
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: orderByClause, // Order products by the specified field and direction
      take, // Limit to 5 products per category
      skip, // You can adjust this for pagination
    });

    if (!products) {
      return new ErrorService.NotFoundError("No se encontraron productos");
    }
    console.log("Products fetched successfully:", products);

    return products;
  },
  getProduct: async ({ id }: { id: number }) => {
    const product: Product | null = await prisma.product.findUnique({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            surnames: true,
            profileImage: true,
            isCompany: true,
            businessName: true,
            phone: true,
            address: true,
            county: {
              select: {
                id: true,
                county: true,
              },
            },
            city: {
              select: {
                id: true,
                city: true,
              },
            },
            region: {
              select: {
                id: true,
                region: true,
              },
            },
          },
        },
        productCategory: {
          select: {
            id: true,
            productCategoryName: true,
            departmentCategoryId: true,
            keywords: true,
            materialImpactEstimateId: true,
            size: true,
            minWeight: true,
            maxWeight: true,
            weightUnit: true,
            departmentCategory: {
              select: {
                id: true,
                departmentCategoryName: true,
                departmentId: true,
                department: {
                  select: {
                    id: true,
                    departmentName: true,
                  },
                },
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            comment: true,
            user: {
              select: {
                id: true,
                name: true,
                businessName: true,
              },
            },
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
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
    const { field = "name", direction = "asc" } = orderBy || {};
    const orderByClause = {
      [field]: direction,
    };
    const products: Product[] = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            surnames: true,
            profileImage: true,
            isCompany: true,
            businessName: true,
            phone: true,
            address: true,
            county: {
              select: {
                id: true,
                county: true,
              },
            },
            city: {
              select: {
                id: true,
                city: true,
              },
            },
            region: {
              select: {
                id: true,
                region: true,
              },
            },
          },
        },
        productCategory: {
          select: {
            id: true,
            productCategoryName: true,
            departmentCategoryId: true,
            keywords: true,
            materialImpactEstimateId: true,
            size: true,
            minWeight: true,
            maxWeight: true,
            weightUnit: true,
            departmentCategory: {
              select: {
                id: true,
                departmentCategoryName: true,
                departmentId: true,
                department: {
                  select: {
                    id: true,
                    departmentName: true,
                  },
                },
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            comment: true,
            user: {
              select: {
                id: true,
                name: true,
                businessName: true,
              },
            },
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: orderByClause, // Order products by the specified field and direction
      take, // Limit to 5 products per category
      skip, // You can adjust this for pagination
      where: { userId: id },
    });

    if (!products) {
      return new ErrorService.NotFoundError("No se encontraron productos");
    }

    return products;
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
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            surnames: true,
            profileImage: true,
            isCompany: true,
            businessName: true,
            phone: true,
            address: true,
            county: {
              select: {
                id: true,
                county: true,
              },
            },
            city: {
              select: {
                id: true,
                city: true,
              },
            },
            region: {
              select: {
                id: true,
                region: true,
              },
            },
          },
        },
        productCategory: {
          select: {
            id: true,
            productCategoryName: true,
            departmentCategoryId: true,
            keywords: true,
            materialImpactEstimateId: true,
            size: true,
            minWeight: true,
            maxWeight: true,
            weightUnit: true,
            departmentCategory: {
              select: {
                id: true,
                departmentCategoryName: true,
                departmentId: true,
                department: {
                  select: {
                    id: true,
                    departmentName: true,
                  },
                },
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            comment: true,
            user: {
              select: {
                id: true,
                name: true,
                businessName: true,
              },
            },
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      where: {
        isActive: true,
        isExchangeable: exchange,
        user: {
          isCompany,
        },
      },
      take,
      orderBy: { createdAt: "desc" },
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
    hasOffer,
    offerPrice,
    stock,
    isActive,
    isExchangeable,
    badges,
    images,
    userId,
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
};
