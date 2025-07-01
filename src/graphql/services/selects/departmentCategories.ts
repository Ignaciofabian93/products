export const departmentSelect = {
  id: true,
  departmentName: true,
};

export const materialTypeSelect = {
  id: true,
  materialType: true,
  estimatedCo2SavingsKG: true,
  estimatedWaterSavingsLT: true,
};

export const productCategorySelect = {
  id: true,
  productCategoryName: true,
  departmentCategoryId: true,
  keywords: true,
  size: true,
  weightUnit: true,
  averageWeight: true,
  firstMaterialTypeId: true,
  firstMaterialTypeQuantity: true,
  firstMaterialType: { select: materialTypeSelect },
  secondMaterialTypeId: true,
  secondMaterialTypeQuantity: true,
  secondMaterialType: { select: materialTypeSelect },
  thirdMaterialTypeId: true,
  thirdMaterialTypeQuantity: true,
  thirdMaterialType: { select: materialTypeSelect },
  fourthMaterialTypeId: true,
  fourthMaterialTypeQuantity: true,
  fourthMaterialType: { select: materialTypeSelect },
  fifthMaterialTypeId: true,
  fifthMaterialTypeQuantity: true,
  fifthMaterialType: { select: materialTypeSelect },
};

export const userSelect = {
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
};

export const productSelect = {
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
  interests: true,
  isActive: true,
  ratings: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  user: { select: userSelect },
};

export const commentSelect = {
  id: true,
  comment: true,
  user: {
    select: {
      id: true,
      name: true,
      businessName: true,
    },
  },
};

export const likeSelect = {
  id: true,
  userId: true,
};
