import gql from "graphql-tag";

export const AuthTypeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Session {
    id: ID!
    name: String!
    email: String!
    token: String!
    isCompany: Boolean!
  }

  extend type User @key(fields: "id") {
    id: ID @external
    name: String @external
    email: String @external
    isCompany: Boolean @external
    createdAt: String @external
    updatedAt: String @external
  }

  extend type Mutation {
    login(email: String!, password: String!): Session
    register(name: String!, email: String!, password: String!): User
    logout: Boolean
    updatePassword(password: String!): Session
  }
`;
