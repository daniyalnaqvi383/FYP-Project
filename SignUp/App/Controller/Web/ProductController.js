import Product from "../../Models/productModel.js";
import uploadoncloudinary from "../../../config/cloudinary.js";


// ============================================
// ADD PRODUCT
// ============================================
export const addProduct = async (req, res) => {
  try {
    console.log("REQ BODY =>", req.body);
    console.log("REQ FILES =>", req.files);

    const {
      name,
      description,
      price,
      oldPrice,
      category,
      subcategory,
      productType,
      status,
      size,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================
    if (!name || !price || !category || !subcategory) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // At least 1 image required
    if (!req.files?.image1) {
      return res.status(400).json({
        success: false,
        message: "At least 1 image is required",
      });
    }

    // =========================
    // UPLOAD IMAGES (CLEAN)
    // =========================
    const uploadedImages = await Promise.all([
      req.files.image1
        ? uploadoncloudinary(req.files.image1[0].path)
        : null,

      req.files.image2
        ? uploadoncloudinary(req.files.image2[0].path)
        : null,

      req.files.image3
        ? uploadoncloudinary(req.files.image3[0].path)
        : null,
    ]);

    const images = uploadedImages.filter(Boolean);

    // =========================
    // PARSE SIZES
    // =========================
    let parsedSizes = [];

    if (size) {
      parsedSizes =
        typeof size === "string" ? JSON.parse(size) : size;
    }

    // =========================
    // CREATE PRODUCT
    // =========================
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      category,
      subcategory,
      productType,
      status,

      sizes: parsedSizes,

      images, // ✅ FINAL FIX (IMPORTANT)
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    console.log("ADD PRODUCT ERROR =>", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// LIST PRODUCTS
// ============================================
export const listProduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// REMOVE PRODUCT
// ============================================
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// FEATURED PRODUCTS
// ============================================
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      productType: "featured",
    });

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// TRENDING PRODUCTS
// ============================================
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      productType: "trending",
    });

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// CATEGORY PRODUCTS
// ============================================
export const getCategoryProducts = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category });

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// SINGLE PRODUCT
// ============================================
export const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// UPDATE PRODUCT (SAFE + UPDATED)
// ============================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // =========================
    // BUILD UPDATE OBJECT SAFELY
    // =========================
    const allowedFields = {
      name: req.body.name,
      description: req.body.description,

      price: req.body.price ? Number(req.body.price) : undefined,
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : null,

      category: req.body.category,
      subcategory: req.body.subcategory,
      productType: req.body.productType,
      status: req.body.status,
    };

    // =========================
    // SAFE SIZES HANDLING (FIX)
    // =========================
    if (req.body.sizes) {
      try {
        allowedFields.sizes =
          typeof req.body.sizes === "string"
            ? JSON.parse(req.body.sizes)
            : req.body.sizes;
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid sizes format",
        });
      }
    }

    // =========================
    // REMOVE UNDEFINED KEYS
    // =========================
    Object.keys(allowedFields).forEach(
      (key) =>
        (allowedFields[key] === undefined ||
          allowedFields[key] === "") &&
        delete allowedFields[key]
    );

    // =========================
    // UPDATE PRODUCT
    // =========================
    const product = await Product.findByIdAndUpdate(
      id,
      allowedFields,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.log("UPDATE PRODUCT ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};