import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Session {
    id: ID!
    name: String!
    email: String!
    token: String!
    isCompany: Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    isCompany: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    users: [User]
    user(id: ID!): User
    me(token: String!): User
  }

  extend type Mutation {
    register(name: String!, email: String!, password: String!, isCompany: Boolean): User
    updatePassword(password: String!): String

    createUser(name: String!, email: String!, password: String!, isCompany: Boolean!): User
    updateUser(id: ID!, name: String!, email: String!, password: String!, isCompany: Boolean!): User
    deleteUser(id: ID!): User
  }
`;
