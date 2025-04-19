import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    hasOffer: Boolean!
    offerPrice: Float
    images: String[]!
    stock: Int!
    categoryId: Int!
    userId: Int!
  }

  extend type Query {
    products: [Product]
    product(id: ID!): Product
  }

  extend type Mutation {
    stockControl(id: ID, quantity: Int, operation: String): Int
    addProduct(
      name: String!
      description: String!
      price: Float!
      hasOffer: Boolean!
      offerPrice: Float
      stock: Int!
      images: String!
      categoryId: Int!
      userId: Int!
    ): Product
    updateProduct(
      id: ID!
      name: String
      description: String
      price: Float
      hasOffer: Boolean
      offerPrice: Float
      stock: Int
      images: String
      categoryId: Int
      userId: Int
    ): Product
    deleteProduct(id: ID!): Product
  }
`;
