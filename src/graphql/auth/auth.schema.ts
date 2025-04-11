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

  extend type Mutation {
    login(email: String!, password: String!): Session
    register(name: String!, email: String!, password: String!): Session
    logout: Boolean
    updatePassword(password: String!): Session
  }
`;
