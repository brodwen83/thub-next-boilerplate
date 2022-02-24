import { gql } from '@apollo/client';

export const typeDefs = gql`
  type User {
    id: ID!
    fullName: String
    username: String
    slug: String
    password: String
    hash: String
    salt: String
    email: String
    joinDate: String
    createdAt: String
    tokenVersion: Int
    verified: Boolean
    approved: Boolean
    role: String
    parent: User
    ancestors: [User]
  }

  input SignUpInput {
    username: String!
    fullName: String!
    email: String!
    password: String!
  }

  # input SignInInput {
  #   email: String!
  #   password: String!
  # }

  input SignInInput {
    usernameOrEmail: String!
    password: String!
  }

  type SignUpPayload {
    user: User!
  }

  type SignInPayload {
    user: User!
  }

  type Query {
    user(id: ID!): User!
    users: [User]!
    viewer: User
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput): SignInPayload!
    # signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!
    createNewUser(input: SignUpInput!): SignUpPayload
  }
`;
