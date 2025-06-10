import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

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
    isActive: Boolean
    ratings: Float
    ratingsCount: Int
    reviewsNumber: Int
    badges: [String]
    productCategoryId: Int!
    productCategory: ProductCategory
    userId: String!
    user: User
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
      name: String!
      description: String!
      price: Int!
      images: [String]
      hasOffer: Boolean
      offerPrice: Int
      stock: Int!
      isExchangeable: Boolean
      isActive: Boolean
      ratings: Float
      ratingsCount: Int
      reviewsNumber: Int
      badges: [String]
      productCategoryId: Int!
      userId: String!
    ): Product
    deleteProduct(id: ID!): Product
  }
`;
