import express from "express";
import Product from "../Models/ProductModel.js";
import data from "../data.js";
import User from "../Models/UserModel.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  try {
    // Delete existing products
    await Product.deleteMany({});
    // Insert new products
    const createdProducts = await Product.insertMany(data.products);

    // Delete existing users
    await User.deleteMany({});
    // Insert new users
    const createdUsers = await User.insertMany(data.users);

    res.send({ createdProducts, createdUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default seedRouter;
