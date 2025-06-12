import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

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

  extend type User @key(fields: "id") {
    id: ID! @external
  }

  type ProductCategory @key(fields: "id") {
    id: ID!
    productCategory: String!
    products: [Product]
  }

  type DepartmentCategory @key(fields: "id") {
    id: ID!
    departmentCategory: String!
  }

  type Department @key(fields: "id") {
    id: ID!
    department: String!
  }

  scalar DateTime

  type ProductLike {
    id: ID!
    userId: String!
    user: User
  }

  type ProductComment {
    id: ID!
    comment: String!
    userId: String!
    user: User
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
    badges: [String]
    createdAt: DateTime!
    updatedAt: DateTime!
    productCategoryId: Int!
    productCategory: ProductCategory
    userId: String!
    user: User
    comments: [ProductComment]
    likes: [ProductLike]
  }

  extend type Query {
    departments: [Department]
    department(id: ID!): Department

    departmentCategoriesByDepartment(id: ID!): [DepartmentCategory]
    departmentCategories: [DepartmentCategory]
    departmentCategory(id: ID!): DepartmentCategory

    productCategoriesByDepartmentCategory(id: ID!): [ProductCategory]
    productCategories: [ProductCategory]
    productCategory(id: ID!): ProductCategory

    productsByProductCategory(id: ID!): [Product]
    products: [Product]
    product(id: ID!): Product
    productsByOwner(id: ID!): [Product]

    feedProducts(limit: Int!, scope: Scope!, exchange: Boolean): [Product]
  }

  extend type Mutation {
    stockControl(id: ID, quantity: Int, operation: String): Int
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
      ratingsCount: Int
      reviewsNumber: Int
      badges: [String]
      productCategoryId: Int!
      userId: String!
    ): Product
    updateProduct(
      sku: String
      barcode: String
      color: String
      brand: String
      name: String
      description: String
      price: Int
      images: [String]
      hasOffer: Boolean
      offerPrice: Int
      stock: Int
      isExchangeable: Boolean
      interests: [String]
      isActive: Boolean
      ratings: Float
      ratingsCount: Int
      reviewsNumber: Int
      badges: [String]
      productCategoryId: Int
      userId: String!
    ): Product
    deleteProduct(id: ID!): Product
  }
`;
