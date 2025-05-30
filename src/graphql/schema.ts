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
  }

  type DepartmentCategory {
    id: ID!
    departmentCategory: String!
    departmentId: Int!
  }

  type Department {
    id: ID!
    department: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Int!
    images: [String]
    hasOffer: Boolean!
    offerPrice: Int
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
      name: String!
      description: String!
      price: Int!
      images: [String]
      hasOffer: Boolean
      offerPrice: Int
      stock: Int!
      size: String
      productCategoryId: Int!
      userId: String!
    ): Product
    updateProduct(
      id: ID!
      name: String
      description: String
      price: Int
      images: [String]
      hasOffer: Boolean
      offerPrice: Int
      stock: Int
      size: String
      productCategoryId: Int
      userId: String
    ): Product
    deleteProduct(id: ID!): Product
  }
`;
