import express from "express";
import mongoose from "mongoose";
import { MONGO_URI, JWT_SECRET } from "./config.js";
import cors from "cors";
import bodyParser from "body-parser";

// import ProductSchemas from "./models/Product.js";
import product from "./product.js";

// console.log(product);

const ProductsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isFev: {
    type: Boolean,
  },
});

const ProductSchemas = mongoose.model("products", ProductsSchema);

const start = async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", async () => {
    console.log("connected to mongodb");
  });

  for (var i = 0; i < product.length; i++) {
    console.log("yaa now we run");
    const post = new ProductSchemas({
      id: product[i]["id"],
      name: product[i]["name"],
      price: product[i]["price"],
      desc: product[i]["desc"],
      category: product[i]["category"],
      image: product[i]["image"],
      isFev: false,
    });
    post.save();
  }
};

start();

// mongoose.connection.on("error", (err) => {
//   console.log("error connecting", err);
// });
