import express from "express";
import upload from "../../Middlewre/multer.js";

import {
  addProduct,
  listProduct,
  removeProduct,
  getFeaturedProducts,
  getTrendingProducts,
  getCategoryProducts,
  singleProduct,
  updateProduct,
} from "../../Controller/Web/ProductController.js";

const productRoutes = express.Router();


// ============================================
// CREATE PRODUCT
// ============================================
productRoutes.post(
  "/",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  addProduct
);


// ============================================
// GET ALL PRODUCTS
// ============================================
productRoutes.get("/", listProduct);


// ============================================
// FEATURED PRODUCTS
// ============================================
productRoutes.get("/featured", getFeaturedProducts);


// ============================================
// TRENDING PRODUCTS
// ============================================
productRoutes.get("/trending", getTrendingProducts);


// ============================================
// CATEGORY FILTER
// ============================================
productRoutes.get("/category/:category", getCategoryProducts);


// ============================================
// SINGLE PRODUCT
// ============================================
productRoutes.get("/:id", singleProduct);


// ============================================
// UPDATE PRODUCT
// ============================================
productRoutes.put(
  "/:id",
  upload.none(), // ✅ SAFE for form-data update (optional fix)
  updateProduct
);


// ============================================
// DELETE PRODUCT
// ============================================
productRoutes.delete("/:id", removeProduct);


export default productRoutes;