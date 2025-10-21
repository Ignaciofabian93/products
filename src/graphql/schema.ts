import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

  # Federated seller type
  extend type Seller @key(fields: "id") {
    id: ID! @external
  }

  enum Badge {
    POPULAR
    DISCOUNTED
    WOMAN_OWNED
    BEST_SELLER
    TOP_RATED
    COMMUNITY_FAVORITE
    LIMITED_TIME_OFFER
    FLASH_SALE
    BEST_VALUE
    HANDMADE
    SUSTAINABLE
    SUPPORTS_CAUSE
    FAMILY_BUSINESS
    CHARITY_SUPPORT
    LIMITED_STOCK
    SEASONAL
    FREE_SHIPPING
    FOR_REPAIR
    REFURBISHED
    EXCHANGEABLE
    LAST_PRICE
    FOR_GIFT
    OPEN_TO_OFFERS
    OPEN_BOX
    CRUELTY_FREE
    DELIVERED_TO_HOME
    IN_HOUSE_PICKUP
    IN_MID_POINT_PICKUP
  }

  enum ProductCondition {
    NEW
    OPEN_BOX
    LIKE_NEW
    FAIR
    POOR
    FOR_PARTS
    REFURBISHED
  }

  enum ProductSize {
    XS
    S
    M
    L
    XL
  }

  enum WeightUnit {
    KG
    LB
    OZ
    G
  }

  scalar DateTime
  scalar JSON

  type PageInfo @shareable {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
    pageSize: Int!
  }

  type Co2ImpactMessage {
    id: ID!
    min: Float
    max: Float
    message1: String
    message2: String
    message3: String
  }

  type WaterImpactMessage {
    id: ID!
    min: Float
    max: Float
    message1: String
    message2: String
    message3: String
  }

  type MaterialImpactEstimate @key(fields: "id") {
    id: ID!
    materialType: String!
    estimatedCo2SavingsKG: Float
    estimatedWaterSavingsLT: Float
    productCategoryMaterials: [ProductCategoryMaterial]
  }

  type Department @key(fields: "id") {
    id: ID!
    departmentName: String!
    departmentImage: String
    departmentCategory: [DepartmentCategory!]!
    products: ProductConnection!
  }

  type DepartmentCategory @key(fields: "id") {
    id: ID!
    departmentId: Int!
    departmentCategoryName: String!
    department: Department
    productCategory: [ProductCategory!]!
    products: ProductConnection!
  }

  type ProductCategory @key(fields: "id") {
    id: ID!
    departmentCategoryId: Int!
    keywords: [String]
    productCategoryName: String!
    size: ProductSize
    averageWeight: Float
    weightUnit: WeightUnit
    products: ProductConnection!
    departmentCategory: DepartmentCategory
    materials: [ProductCategoryMaterial]
  }

  type ProductCategoryMaterial {
    id: ID!
    productCategoryId: Int!
    materialTypeId: ID!
    quantity: Float!
    unit: String!
    isPrimary: Boolean!
    productCategory: ProductCategory
    material: MaterialImpactEstimate
  }

  type Product @key(fields: "id") {
    id: ID!
    name: String!
    description: String!
    price: Int!
    hasOffer: Boolean!
    offerPrice: Int!
    sellerId: String!
    badges: [Badge!]!
    brand: String!
    color: String
    createdAt: DateTime!
    images: [String!]!
    interests: [String!]!
    isActive: Boolean!
    isExchangeable: Boolean!
    productCategoryId: Int!
    updatedAt: DateTime!
    condition: ProductCondition!
    conditionDescription: String
    productCategory: ProductCategory
    seller: Seller
  }

  type StoreCategory @key(fields: "id") {
    id: ID!
    category: String!
    subcategories: [StoreSubCategory!]!
    products: StoreProductConnection!
  }

  type StoreSubCategory @key(fields: "id") {
    id: ID!
    storeCategoryId: Int!
    subcategory: String!
    storeCategory: StoreCategory
    products: StoreProductConnection
    productCount: Int
  }

  type StoreProductMaterial @key(fields: "id") {
    id: ID!
    storeProductId: Int!
    materialTypeId: ID!
    quantity: Float!
    unit: String!
    isPrimary: Boolean!
    sourceMaterial: String
    isRecycled: Boolean!
    recycledPercentage: Float
    supplierVerified: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    storeProduct: StoreProduct
    material: MaterialImpactEstimate
  }

  type StoreProduct @key(fields: "id") {
    id: ID!
    name: String!
    description: String!
    stock: Int!
    barcode: String
    sku: String
    price: Int!
    hasOffer: Boolean!
    offerPrice: Int!
    sellerId: String!
    images: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    isActive: Boolean!
    badges: [Badge!]!
    brand: String!
    color: String
    ratingCount: Int!
    ratings: Float!
    reviewsNumber: Int!
    materialComposition: String
    recycledContent: Float
    subcategoryId: Int!
    sustainabilityScore: Int
    carbonFootprint: Float
    productVariants: [ProductVariant!]!
    storeSubCategory: StoreSubCategory
    seller: Seller
    materials: [StoreProductMaterial!]!
  }

  type ProductLike {
    id: ID!
    storeProductId: Int!
    sellerId: String!
  }

  type ProductComment {
    id: ID!
    comment: String!
    storeProductId: Int!
    sellerId: String!
    createdAt: DateTime!
    rating: Int
    seller: Seller
  }

  type ProductVariant {
    id: ID!
    storeProductId: Int!
    name: String!
    price: Int!
    stock: Int!
    color: String
    size: String
    createdAt: DateTime!
    updatedAt: DateTime!
    storeProduct: StoreProduct
  }

  input AddProductInput {
    sku: String
    barcode: String
    color: String
    brand: String!
    name: String!
    description: String!
    price: Int!
    images: [String!]!
    hasOffer: Boolean
    offerPrice: Int
    stock: Int!
    isExchangeable: Boolean
    interests: [String!]
    isActive: Boolean
    badges: [Badge!]
    productCategoryId: Int!
    sellerId: String!
    condition: ProductCondition
    conditionDescription: String
    sustainabilityScore: Int
    materialComposition: String
    recycledContent: Float
  }

  input UpdateProductInput {
    id: ID!
    sku: String
    barcode: String
    color: String
    brand: String
    name: String
    description: String
    price: Int
    images: [String!]
    hasOffer: Boolean
    offerPrice: Int
    stock: Int
    isExchangeable: Boolean
    interests: [String!]
    isActive: Boolean
    badges: [Badge!]
    productCategoryId: Int
    condition: ProductCondition
    conditionDescription: String
    sustainabilityScore: Int
    materialComposition: String
    recycledContent: Float
  }

  input AddStoreProductInput {
    sku: String
    barcode: String
    color: String
    brand: String
    name: String!
    description: String!
    price: Int!
    images: [String!]!
    hasOffer: Boolean
    offerPrice: Int
    stock: Int!
    isActive: Boolean
    badges: [Badge!]
    subcategoryId: Int!
    sellerId: String!
    sustainabilityScore: Int
    materialComposition: String
    recycledContent: Float
    carbonFootprint: Float
  }

  input UpdateStoreProductInput {
    id: ID!
    sku: String
    barcode: String
    color: String
    brand: String
    name: String
    description: String
    price: Int
    images: [String!]
    hasOffer: Boolean
    offerPrice: Int
    stock: Int
    isActive: Boolean
    badges: [Badge!]
    subcategoryId: Int
    sustainabilityScore: Int
    materialComposition: String
    recycledContent: Float
    carbonFootprint: Float
  }

  type DepartmentConnection {
    nodes: [Department!]!
    pageInfo: PageInfo!
  }

  type DepartmentCategoryConnection {
    nodes: [DepartmentCategory!]!
    pageInfo: PageInfo!
  }

  type ProductCategoryConnection {
    nodes: [ProductCategory!]!
    pageInfo: PageInfo!
  }

  type ProductConnection {
    nodes: [Product!]!
    pageInfo: PageInfo!
  }

  type StoreCategoryConnection {
    nodes: [StoreCategory!]!
    pageInfo: PageInfo!
  }

  type StoreSubCategoryConnection {
    nodes: [StoreSubCategory!]!
    pageInfo: PageInfo!
  }

  type StoreProductConnection {
    nodes: [StoreProduct!]!
    pageInfo: PageInfo!
  }

  extend type Query {
    # Catalog Queries
    marketCatalog: [Department]
    storeCatalog: [StoreCategory]

    # Marketplace Queries
    getDepartment(id: ID!): Department
    getDepartmentCategories(departmentId: ID!, page: Int = 1, pageSize: Int = 10): DepartmentCategoryConnection
    getProductCategory(id: ID!): ProductCategory
    getProductCategories(departmentCategoryId: ID!, page: Int = 1, pageSize: Int = 10): ProductCategoryConnection

    # Product Queries
    getProduct(id: ID!): Product
    getProducts(page: Int = 1, pageSize: Int = 10, isActive: Boolean): ProductConnection
    getProductsBySeller(sellerId: ID!, page: Int = 1, pageSize: Int = 10, isActive: Boolean): ProductConnection
    getProductsByCategory(
      productCategoryId: ID!
      page: Int = 1
      pageSize: Int = 10
      isActive: Boolean
    ): ProductConnection
    getExchangeableProducts(page: Int = 1, pageSize: Int = 10): ProductConnection

    # Store Queries
    getStoreCategory(id: ID!): StoreCategory
    getStoreSubCategories(storeCategoryId: ID!, page: Int = 1, pageSize: Int = 10): StoreSubCategoryConnection
    getStoreSubCategory(id: ID!): StoreSubCategory

    # Store Product Queries
    getStoreProduct(id: ID!): StoreProduct
    getStoreProducts(page: Int = 1, pageSize: Int = 10, isActive: Boolean): StoreProductConnection
    getStoreProductsBySeller(
      sellerId: ID!
      page: Int = 1
      pageSize: Int = 10
      isActive: Boolean
    ): StoreProductConnection
    getStoreProductsBySubCategory(
      subcategoryId: ID!
      page: Int = 1
      pageSize: Int = 10
      isActive: Boolean
    ): StoreProductConnection

    # Comments and Likes
    getProductComments(storeProductId: ID!, page: Int = 1, pageSize: Int = 10): [ProductComment!]!
    getProductLikes(storeProductId: ID!): [ProductLike!]!

    # Impact Queries
    getMaterialImpacts: [MaterialImpactEstimate!]!
    getCo2ImpactMessages: [Co2ImpactMessage!]!
    getWaterImpactMessages: [WaterImpactMessage!]!
  }

  extend type Mutation {
    # Marketplace Mutations
    addProduct(input: AddProductInput!): Product
    updateProduct(input: UpdateProductInput!): Product
    deleteProduct(id: ID!): Product
    toggleProductActive(id: ID!): Product

    # Store Mutations
    addStoreProduct(input: AddStoreProductInput!): StoreProduct
    updateStoreProduct(input: UpdateStoreProductInput!): StoreProduct
    deleteStoreProduct(id: ID!): StoreProduct
    toggleStoreProductActive(id: ID!): StoreProduct

    # Product Interactions
    likeProduct(storeProductId: ID!, sellerId: ID!): ProductLike
    unlikeProduct(storeProductId: ID!, sellerId: ID!): Boolean
    addProductComment(storeProductId: ID!, sellerId: ID!, comment: String!, rating: Int): ProductComment
    deleteProductComment(id: ID!): Boolean
  }
`;
