import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { TokenValidation } from "../../middleware/tokenValidation";
import { type Context } from "../../types/context";
import { Product } from "../../types/product";

export const ProductService = {
  getDepartments: async () => {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        department: true,
        departmentCategories: true,
      },
    });

    if (!departments.length) {
      return new ErrorService.NotFoundError("No se encontraron departamentos");
    }

    return departments;
  },
  getDepartment: async ({ id }: { id: number }) => {
    if (!id) {
      return new ErrorService.BadRequestError("No es posible encontrar el departamento");
    }

    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
      include: {
        departmentCategories: true,
      },
    });

    return department;
  },
  getDepartmentCategories: async () => {
    const departmentCategories = await prisma.departmentCategory.findMany();

    if (!departmentCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return departmentCategories;
  },
  getDepartmentCategory: async ({ id }: { id: number }) => {
    if (!id) {
      return new ErrorService.BadRequestError("No es posible encontrar la categoría");
    }

    const departmentCategory = await prisma.departmentCategory.findUnique({
      where: { id: Number(id) },
      include: {
        department: true,
        productCategories: true,
      },
    });

    if (!departmentCategory) {
      return new ErrorService.NotFoundError("No se encontró la categoría");
    }

    return departmentCategory;
  },
  getProductCategories: async () => {
    const productCategories = await prisma.productCategory.findMany();

    if (!productCategories.length) {
      return new ErrorService.NotFoundError("No se encontraron categorías");
    }

    return productCategories;
  },
  getProductCategory: async ({ id }: { id: number }) => {
    if (!id) {
      return new ErrorService.BadRequestError("No es posible encontrar la categoría");
    }

    const productCategory = await prisma.productCategory.findUnique({
      where: { id: Number(id) },
      include: {
        departmentCategory: true,
        products: true,
      },
    });

    if (!productCategory) {
      return new ErrorService.NotFoundError("No se encontró la categoría");
    }

    return productCategory;
  },
  getProducts: async () => {
    const products = await prisma.product.findMany({});

    if (!products) {
      return new ErrorService.NotFoundError("No se encontraron productos");
    }

    return products;
  },
  getProduct: async ({ id }: { id: number }) => {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return new ErrorService.NotFoundError("Producto no encontrado");
    }

    return product;
  },
  addProduct: async (
    {
      name,
      description,
      price,
      hasOffer,
      offerPrice,
      stock,
      images,
      userId,
      productCategoryId,
      size,
    }: Omit<Product, "id">,
    { token }: Context,
  ) => {
    const userIdToken = TokenValidation(token as string) as string;

    if (!userIdToken) {
      return new ErrorService.UnAuthorizedError("No autorizado");
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        hasOffer,
        offerPrice,
        stock,
        images,
        userId,
        productCategoryId,
        size,
      },
    });

    if (!product) {
      return new ErrorService.InternalServerError("Error al crear el producto");
    }

    return product;
  },
  updateProduct: async (
    { id, name, description, price, hasOffer, offerPrice, stock, images, productCategoryId, size, userId }: Product,
    { token }: Context,
  ) => {
    const userIdToken = TokenValidation(token as string) as string;

    if (!userIdToken) {
      return new ErrorService.UnAuthorizedError("No autorizado");
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price,
        hasOffer,
        offerPrice,
        stock,
        images,
        userId,
        productCategoryId,
        size,
      },
    });

    if (!product) {
      return new ErrorService.InternalServerError("Error al actualizar el producto");
    }

    return product;
  },
  deleteProduct: async ({ id }: { id: number }, { token }: Context) => {
    const userId = TokenValidation(token as string) as string;

    if (!userId) {
      return new ErrorService.UnAuthorizedError("No autorizado");
    }

    const product = await prisma.product.delete({
      where: { id: Number(id) },
    });

    if (!product) {
      return new ErrorService.InternalServerError("Error al eliminar el producto");
    }

    return product;
  },
  stockControl: async (
    { id, operation, amount }: { id: number; operation: string; amount: number },
    { token }: Context,
  ) => {
    const userId = TokenValidation(token as string) as string;

    if (!userId) {
      return new ErrorService.UnAuthorizedError("No autorizado");
    }

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
          stock: product.stock + amount,
        },
      });

      return updatedProduct;
    } else if (operation === "subtract") {
      if (product.stock < amount) {
        return new ErrorService.BadRequestError("No hay suficiente stock");
      }

      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          stock: product.stock - amount,
        },
      });

      return updatedProduct;
    } else {
      return new ErrorService.BadRequestError("Operación no válida");
    }
  },
};
