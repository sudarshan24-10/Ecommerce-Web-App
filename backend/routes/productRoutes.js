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
    console.log(req)
    try {
      const { query } = req;
      const pageSize = query.pageSize || PAGE_SIZE;
      const page =query.page || 1;
      const category = query.category || "";
      const brand = query.brand || '';
      const price = query.price || "";
      const rating = query.rating || "";
      const order = query.order || "";
      const searchQuery = query.query || "";
      console.log(searchQuery)
      const queryFilter = searchQuery && searchQuery !== "all" ? { name: { $regex: searchQuery, $options: "i" }, } : {};
      const categoryFilter = category && category !== "all" ? { category } : {};
      const ratingFilter = rating && rating!== "all" ? { rating: { $gte: Number(rating) } } : {};
      const priceFilter =
        price && price !== "all"
          ? { price: { $gte: Number(price.split("-")[0]), $lte: Number(price.split("-")[1]) } }
          : {};

      const sortOrder =
        order === "featured"
          ? { featured: -1 }
          : order === "lowest"
          ? { price: 1 }
          : order === "highest"
          ? { price: -1 }
          : order === "toprated"
          ? { rating: -1 }
          : order === "newest"
          ? { createdAt: -1 }
          : { _id: -1 };
      console.log(queryFilter,categoryFilter,ratingFilter,priceFilter)

      const queryiFilter = { name: 'Nike Slim Pant' }
      const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...ratingFilter,
        ...priceFilter,
      })
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);
      console.log(products)
      const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...ratingFilter,
        ...priceFilter,
      });

      res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
      });
    } catch (error) {
      console.error(error);
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
