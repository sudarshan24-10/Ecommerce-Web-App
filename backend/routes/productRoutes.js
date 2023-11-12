import express from "express";
import Product from "../Models/ProductModel.js";
import expressAsyncHandler from "express-async-handler";

const productRouter = express.Router();

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const products = await Product.find();
      res.send(products);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

const PAGE_SIZE = 3;

productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    try {
      const { query } = req;
      // ... (your existing code)
      const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      })
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);

      const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      });

      res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
      });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    try {
      const categories = await Product.find().distinct("category");
      res.send(categories);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

productRouter.get(
  "/slug/:slug",
  expressAsyncHandler(async (req, res) => {
    try {
      const product = await Product.findOne({ slug: req.params.slug });
      if (product) {
        res.send(product);
      } else {
        res.status(404).send({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.send(product);
      } else {
        res.status(404).send({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

export default productRouter;
