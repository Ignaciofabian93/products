import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  extend type User @key(fields: "id") {
    id: ID! @federation__external
  }

  type ProductCategory {
    id: ID!
    productCategory: String!
    products: [Product]
    departmentCategoryId: Int!
    departmentCategory: DepartmentCategory
  }

  type DepartmentCategory {
    id: ID!
    departmentCategory: String!
    departmentId: Int!
    department: Department
    productCategories: [ProductCategory]
  }

  type Department {
    id: ID!
    department: String!
    departmentCategories: [DepartmentCategory]
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    images: [String]
    hasOffer: Boolean!
    offerPrice: Float
    stock: Int!
    size: String!
    productCategoryId: Int!
    productCategory: ProductCategory
    userId: String!
    user: User
  }

  extend type Query {
    departments: [Department]
    department(id: ID!): Department
    departmentCategories: [DepartmentCategory]
    departmentCategory(id: ID!): DepartmentCategory
    productCategories: [ProductCategory]
    productCategory(id: ID!): ProductCategory
    products: [Product]
    product(id: ID!): Product
  }

  extend type Mutation {
    stockControl(id: ID, quantity: Int, operation: String): Int
    addProduct(
      name: String!
      description: String!
      price: Float!
      images: [String]
      hasOffer: Boolean!
      offerPrice: Float
      stock: Int!
      size: String
      productCategoryId: Int!
      userId: String!
    ): Product
    updateProduct(
      id: ID!
      name: String
      description: String
      price: Float
      images: [String]
      hasOffer: Boolean
      offerPrice: Float
      stock: Int
      size: String
      productCategoryId: Int
      userId: String
    ): Product
    deleteProduct(id: ID!): Product
  }
`;
