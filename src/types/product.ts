export type ProductCategory = {
  id: number;
  productCategory: string;
  products: Product[];
  departmentCategoryId: number;
  departmentCategory: DepartmentCategory;
};

export type DepartmentCategory = {
  id: number;
  departmentCategory: string;
  departmentId: number;
  department: Department;
  productCategories: ProductCategory[];
};

export type Department = {
  id: number;
  department: string;
  departmentCategories: DepartmentCategory[];
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  hasOffer: boolean;
  offerPrice: number;
  stock: number;
  size: string;
  productCategoryId: number;
  userId: string;
};
