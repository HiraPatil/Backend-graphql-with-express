import { ApolloServer } from "apollo-server";
import express from "express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from "./schemaGql.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MONGO_URI, JWT_SECRET } from "./config.js";
import cors from "cors";
import bodyParser from "body-parser";
import { graphqlUploadExpress } from "graphql-upload";
import "./models/Quotes.js";
import "./models/User.js";
import "./models/Product.js";
import "./models/Cart.js";

// import userMutation from "./resolver/User";
import resolvers from "./resolvers.js";

// const resolvers ={
//     userMutation,
//     userQueries
// }
//
// import resolvers from "./resolver/index";

const app = express();

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

mongoose.connection.on("error", (err) => {
  console.log("error connecting", err);
});

//import models here

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(graphqlUploadExpress());
app.use(cors());

const context = ({ req }) => {
  const { authorization } = req.headers;
  if (authorization) {
    const { userId } = jwt.verify(authorization, JWT_SECRET);
    return { userId };
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen(8001).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
