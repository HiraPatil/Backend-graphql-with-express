import mongoose, { Query } from "mongoose";
const User = mongoose.model("User");
const Quote = mongoose.model("Quote");
const Product = mongoose.model("products");
const Cart = mongoose.model("cart");
import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as yup from "yup";
import { JWT_SECRET } from "./config.js";
import path from "path";
import Products from "./product.js";

const resolvers = {
  Query: {
    Hello: () => {
      return "hello brother";
    },
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
    product: async () => {
      const products = await Product.find({});
      return products;
    },
    getCart: async () => {
      return await Cart.find({});
    },
    getFevItems: async () => {
      const val = await Product.find({ isFev: true });
      console.log(val);
      return val;
    },
  },
  User: {
    quotes: (ur) => quotes.filter((quote) => quote.by == ur._id),
  },

  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      if (user) {
        throw new Error("User already exists with that email");
      }
      if (
        !userNew.firstName ||
        !userNew.lastName ||
        !userNew.email ||
        !userNew.password
      ) {
        throw new ApolloError("All Fields Are Required");
      }

      const emailExpression =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const isValidName = userNew.firstName.length;

      if (isValidName < 3 || isValidName > 30) {
        throw new ApolloError("your Name must be at least 3 character");
      }

      const isValidLname = userNew.lastName.length;

      if (isValidLname < 3 || isValidLname > 30) {
        throw new ApolloError("your Last Name must be at least 3 character");
      }

      const isValidEmail = emailExpression.test(
        String(userNew.email).toLowerCase()
      );
      if (!isValidEmail) throw new ApolloError("email not in proper format");

      const isValidpass = userNew.password.length;
      if (isValidpass < 5 || isValidpass > 30) {
        throw new ApolloError("your password must be at least 5 character");
      }
      const hashedPassword = await bcrypt.hash(userNew.password, 12);

      const newUser = new User({
        ...userNew,
        password: hashedPassword,
      });
      return await newUser.save();
    },

    signinUser: async (_, { userSignin }) => {
      console.log("called");
      const user = await User.findOne({ email: userSignin.email });
      if (!user) {
        throw new Error("User dosent exists with that email");
      }

      if (!userSignin.email || !userSignin.password) {
        throw new ApolloError("All Field are Required");
      }

      const doMatch = await bcrypt.compare(userSignin.password, user.password);
      if (!doMatch) {
        throw new Error("email or password in invalid");
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      return { token, firstname: user.firstName };
    },
    cartprodouct: async (_, { productinput }) => {
      console.log(productinput);
      const cart = await Cart.findOne({ id: productinput.id });
      if (cart) {
        await Cart.findOneAndUpdate(
          { id: productinput.id },
          { $set: { count: cart.count + 1 } }
        );
        return Cart.findOne({ id: productinput.id });
      }
      const cartnew = new Cart({
        ...productinput,
        count: 1,
      });

      return await cartnew.save();
    },

    addToCart: async (_, { productinput }) => {
      const cart = await Product.findOne({ id: productinput.id });
      console.log(cart);
      if (cart) {
        await Product.findOneAndUpdate(
          { id: productinput.id },
          { $set: { count: cart.count + 1 } }
        );
        return Product.findOne({ id: productinput.id });
      }
      const cartnew = new Product({
        ...productinput,
      });
      console.log(cartnew);
      return await cartnew.save();
    },

    removeCart: async (_, { productinput }) => {
      const cart = await Cart.findOne({ id: productinput.id });

      if (cart) {
        if (cart.count === 1) {
          await Cart.remove({ id: cart.id });
        } else {
          await Cart.findOneAndUpdate(
            { id: productinput.id },
            { $set: { count: cart.count - 1 } }
          );
          return Cart.findOne({ id: productinput.id });
        }
      }
    },

    AddToFev: async (_, { fevInput }) => {
      console.log(fevInput.id, fevInput.status);

      // const update = { isFev: fevInput.status };

      // const filter = { id: fevInput.id };

      // const fev = await Product.findOneAndUpdate(filter, update);

      // const fev = await Product.findOneAndUpdate(
      //   { id: fevInput.id },
      //   { $set: { isFev: fevInput.status } }
      // );
      // return fev;

      // const cart = await Product.find({});

      // if (cart) {
      //   await Product.findOneAndUpdate(
      //     { id: fevInput.id },
      //     { $set: { isFev: fevInput.status } }
      //   );
      //   return Product.findOne({ id: fevInput.id });
      // }
      // cart.map((item) => {
      //   if (item.id === fevInput.id) {
      //     cart.isFev = fevInput.status;
      //   }
      // });
      // return cart;

      try {
        let product = await Product.findOneAndUpdate(
          {
            id: fevInput.id,
          },
          { $set: { isFev: fevInput.status } },
          { returnOriginal: false }
        );
        console.log(product);
        return product;
      } catch (e) {
        console.log(e);
      }
    },
    RemoveToFev: async () => {
      const changeFev = await Product.find({ isFev: true });

      console.log(changeFev);

      // changeFev.map((item) => {
      //   item.isFev = false;
      // });
      const Newchange = changeFev.map(async (item) => {
        return await Product.findOneAndUpdate(
          { isFev: true },
          { $set: { isFev: false } }
        );
      });
      console.log(changeFev);
      return changeFev;
    },
    RemoveToFevOne: async (_, data) => {
      console.log(data);
      const changeFev = await Product.findOneAndUpdate(
        { id: data.id },
        { $set: { isFev: false } }
      );
      return changeFev;
    },
  },
};

export default resolvers;
