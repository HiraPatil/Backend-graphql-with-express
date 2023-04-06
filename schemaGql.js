import { gql } from "apollo-server";
const typeDefs = gql`
  type Query {
    product: [Product]
    users: [User]
    user(_id: ID!): User
    quotes: [QuoteWithName]
    iquote(by: ID!): [Quote]
    Hello: String!
    getCart: [cart]!
    getFevItems: [Product]!
  }

  type Product {
    id: Int!
    name: String!
    desc: String!
    category: String!
    image: String!
    price: Float!
    isFev: Boolean
  }
  type cart {
    id: Int!
    name: String!
    desc: String!
    category: String!
    image: String!
    price: Float!
    count: Int!
  }

  type QuoteWithName {
    name: String
    by: IdName
  }

  type IdName {
    _id: String
    firstName: String
  }

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    quotes: [Quote]
  }
  type Quote {
    name: String!
    by: ID!
  }

  type Error {
    path: String!
    message: String!
  }

  type Token {
    token: String!
  }

  type Mutation {
    signupUser(userNew: UserInput!): User!
    signinUser(userSignin: UserSigninInput!): Token
    createQuote(name: String!): String

    cartprodouct(productinput: ProductInput!): cart
    addToCart(productinput: ProductInput!): cart
    removeCart(productinput: ProductInput!): cart
    AddToFev(fevInput: FevInnput!): Product!
    RemoveToFevOne(id: Int!): Product!
    RemoveToFev: [Product]!
  }

  input ProductInput {
    id: Int
    name: String
    price: Float
    desc: String
    category: String
    image: String
    isFev: Boolean
    count: Int
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  input UserSigninInput {
    email: String!
    password: String!
  }
  input FevInnput {
    status: Boolean!
    id: Int!
  }
`;
export default typeDefs;
