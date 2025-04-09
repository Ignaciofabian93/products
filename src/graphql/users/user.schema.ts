import gql from "graphql-tag";

export const UserTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    isCompany: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    users: [User]
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(name: String!, email: String!, password: String!, isCompany: Boolean!): User
    updateUser(id: ID!, name: String!, email: String!, password: String!, isCompany: Boolean!): User
    deleteUser(id: ID!): User
  }
`;
