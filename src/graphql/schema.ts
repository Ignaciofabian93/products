import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

  # Federated enums from users subgraph
  enum AccountType {
    FREE
    PLUS
    PREMIUM
  }

  enum SellerType {
    PERSON
    STORE
  }

  enum ContactMethod {
    EMAIL
    WHATSAPP
    ALL
  }

  # Federated user type
  extend type User @key(fields: "id") {
    id: ID! @external
  }

  enum Scope {
    MARKET
    STORE
  }

  enum Badge {
    POPULAR
    DISCOUNTED
    WOMAN_OWNED
    ECO_FRIENDLY
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
    NEW
    USED
    SLIGHT_DAMAGE
    WORN
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

  # Remove local User extension, now federated above

  type MaterialImpactEstimate @key(fields: "id") {
    id: ID!
    materialType: String!
    estimatedCo2SavingsKG: Float
    estimatedWaterSavingsLT: Float
    firstMaterialTypeFor: [ProductCategory]
    secondMaterialTypeFor: [ProductCategory]
    thirdMaterialTypeFor: [ProductCategory]
    fourthMaterialTypeFor: [ProductCategory]
    fifthMaterialTypeFor: [ProductCategory]
  }

  type ProductCategory @key(fields: "id") {
    id: ID!
    productCategoryName: String!
    departmentCategoryId: Int!
    departmentCategory: DepartmentCategory
    keywords: [String]
    averageWeight: Float
    firstMaterialTypeId: Int
    firstMaterialTypeQuantity: Float
    secondMaterialTypeId: Int
    secondMaterialTypeQuantity: Float
    thirdMaterialTypeId: Int
    thirdMaterialTypeQuantity: Float
    fourthMaterialTypeId: Int
    fourthMaterialTypeQuantity: Float
    fifthMaterialTypeId: Int
    fifthMaterialTypeQuantity: Float
    size: ProductSize
    weightUnit: WeightUnit
    products: [Product]
    firstMaterialType: MaterialImpactEstimate
    secondMaterialType: MaterialImpactEstimate
    thirdMaterialType: MaterialImpactEstimate
    fourthMaterialType: MaterialImpactEstimate
    fifthMaterialType: MaterialImpactEstimate
  }

  type DepartmentCategory @key(fields: "id") {
    id: ID!
    departmentCategoryName: String!
    departmentId: Int!
    department: Department
    productCategories: [ProductCategory]
  }

  type Department @key(fields: "id") {
    id: ID!
    departmentName: String!
    departmentCategories: [DepartmentCategory]
  }

  scalar DateTime
  scalar JSON

  type ProductLike {
    id: ID!
    userId: String!
    user: User # Add federated user reference for likes
  }

  type ProductComment {
    id: ID!
    comment: String!
    userId: String!
    user: User # Federated user reference
  }

  type Product @key(fields: "id") {
    id: ID!
    sku: String
    barcode: String
    color: String
    brand: String
    name: String!
    description: String!
    price: Int!
    images: [String]
    hasOffer: Boolean
    offerPrice: Int
    stock: Int!
    isExchangeable: Boolean
    interests: [String]
    isActive: Boolean
    ratings: Float
    ratingCount: Int
    reviewsNumber: Int
    badges: [Badge]
    createdAt: DateTime!
    updatedAt: DateTime!
    productCategoryId: Int!
    productCategory: ProductCategory
    userId: String!
    user: User # Federated user reference
    comments: [ProductComment]
    likes: [ProductLike]
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

  enum SortDirection {
    asc
    desc
  }

  input OrderByInput {
    field: String!
    direction: SortDirection!
  }

  extend type Query {
    marketCatalog: [Department]
  }

  extend type Mutation {
    addProduct(
      sku: String
      barcode: String
      color: String
      brand: String
      name: String!
      description: String!
      price: Int!
      images: [String]
      hasOffer: Boolean
      offerPrice: Int
      stock: Int!
      isExchangeable: Boolean
      interests: [String]
      isActive: Boolean
      ratings: Float
      ratingCount: Int
      reviewsNumber: Int
      badges: [Badge]
      productCategoryId: Int!
      userId: String!
    ): Product
    updateProduct(
      id: ID!
      sku: String
      barcode: String
      color: String
      brand: String
      name: String!
      description: String!
      price: Int!
      images: [String]
      hasOffer: Boolean
      offerPrice: Int
      stock: Int!
      isExchangeable: Boolean
      interests: [String]
      isActive: Boolean
      ratings: Float
      ratingCount: Int
      reviewsNumber: Int
      badges: [Badge]
      productCategoryId: Int!
      userId: String!
    ): Product
    deleteProduct(id: ID!): Product
    likeProduct(id: ID!, userId: ID!): Product
  }
`;
