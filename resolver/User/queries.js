import mongoose, { Query } from "mongoose";
const User = mongoose.model("User");
import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as yup from "yup";
import { JWT_SECRET } from "../config.js";

const userQueries = {
  Query: {
    users: async (_, {}, context) => {
      console.log(context);
      if (!context.userId) {
        throw new ApolloError("you must be logged in");
      }
      const users = await User.find({});
      return users;
    },
    user: async (_, { _id }) => await User.findOne({ _id }),
    quotes: () => quotes,
    iquote: (_, { by }) => quotes.filter((quote) => quote.by == by),
  },
  User: {
    quotes: (ur) => quotes.filter((quote) => quote.by == ur._id),
  },
};

export default userQueries;
