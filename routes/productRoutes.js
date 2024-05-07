const express = require("express");
const Product = require("../model/productModel.js");
const isLoggedIn = require("../middleware/middleware.js");
const isSeller = require("../middleware/middleware.js");
const User = require("../model/userModel.js");

const router = express.Router();

router.get("/product/new", (req, res) => {
  res.render("products/addProduct");
});

router.get("/product", async (req, res) => {
  const allProduct = await Product.find({});
  // console.log(allProduct);
  res.render("products/home", { allProduct });
});

router.post("/product", async (req, res) => {
  try {
    await Product.create(req.body);
    req.flash("success", "product created successfully");
    // req.flash('info', 'Flash is back!')
    res.redirect("/product");
  } catch (error) {
    //  req.flash("error", "something is going wrong")
    console.log(error);
  }
});

router.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const singleProduct = await Product.findById(id);
  // console.log(singleProduct);
  res.render("products/singleProduct", { item: singleProduct });
});

router.get("/product/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { i: product });
});

router.patch("/product/:id", async (req, res) => {
  const { id } = req.params;

  const { productName, price, description, imageUrl } = req.body;

  await Product.findByIdAndUpdate(id, {
    productName,
    price,
    description,
    imageUrl,
  });

  res.redirect(`/product/${id}`);
});

router.delete("/product/:id", async (req, res) => {
  const { id } = req.params;

  await Product.findByIdAndDelete(id);

  req.flash("success", "product deleted successfully");

  res.redirect("/product");
});

router.get("/cart", async (req, res) => {
  const data = await User.findById(req.user._id).populate("cart");
  res.render("product/cart", { data });
});

router.post("/product/:id/cart", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  const user = req.user;

  user.cart.push(product);
  await user.save();
  res.redirect("/cart");
});

router.post("/product/:productId/like", async (req, res) => {
  const { productId } = req.params;

  const user = req.user;

  const isExisted = user.like.some((item) => item.id.equals(productId));

  if (isExisted) {
    const updateLike = user.like.filter((item) => item.id != productId);
    user.like = updateLike;
  } else {
    user.like.push(productId);
  }

  await user.save();
});

module.exports = router;
