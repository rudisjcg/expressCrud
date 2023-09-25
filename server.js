const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();
const app = express();

const mongoURI = process.env.MONGO_URI;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello node Api");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.post("/product", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.put("/product/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await Product.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.delete("/product/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(_id);
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("connected to Mongo!");
    app.listen(3000);
  })
  .catch((error) => {
    console.log("error connecting to Mongo", error);
  });
