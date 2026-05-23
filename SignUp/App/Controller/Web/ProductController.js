import Product from "../../Models/productModel.js";
import uploadoncloudinary from "../../../config/cloudinary.js";

// ============================================
// A. ADD NEW PRODUCT (POST)
// ============================================
export const addProduct = async (req, res) => {
  try {
    console.log("📥 ADMIN BACKEND => Adding new product payload...");
    console.log("REQ BODY =>", req.body);

    const {
      name,
      description,
      price,
      oldPrice,
      category,
      subcategory,
      styleType,    
      productType,  
      status,
      size,
    } = req.body;

    if (!name || !price || !category || !subcategory || !styleType) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing (Make sure styleType, category, and subcategory are provided)",
      });
    }

    if (!req.files?.image1) {
      return res.status(400).json({
        success: false,
        message: "At least 1 core image (image1) is required to build product identity",
      });
    }

    const uploadedImages = await Promise.all([
      req.files.image1 ? uploadoncloudinary(req.files.image1[0].path) : null,
      req.files.image2 ? uploadoncloudinary(req.files.image2[0].path) : null,
      req.files.image3 ? uploadoncloudinary(req.files.image3[0].path) : null,
    ]);

    const images = uploadedImages.filter(Boolean);

    let parsedSizes = [];
    if (size) {
      parsedSizes = typeof size === "string" ? JSON.parse(size) : size;
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      category,
      subcategory,
      styleType,
      productType,
      status,
      sizes: parsedSizes,
      images, 
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully across all channel matrices",
      product,
    });

  } catch (error) {
    console.log("🔥 ADD PRODUCT EXCEPTION CRASH =>", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// B. UNIVERSAL MASTER LIST & FILTER (GET) - UPDATED WITH SEARCH
// ============================================
export const listProduct = async (req, res) => {
  try {
    // 💡 UPDATED: Added 'search' parameter inside the query restructuring object
    const { category, subcategory, styleType, productType, search } = req.query; 
    let filterQuery = {};

    // Conditionals mapping block for cross-filtering routing logic
    if (category) filterQuery.category = category;
    if (subcategory) filterQuery.subcategory = subcategory;
    if (styleType) filterQuery.styleType = styleType; 
    if (productType) filterQuery.productType = productType;

    // 💡 UPDATED: MongoDB Regex filter logic inject ki hai
    if (search) {
      filterQuery.name = { $regex: search, $options: "i" }; // 'i' is case-insensitive filter indicator
    }

    // Single query lookup handling dataset dynamically
    const products = await Product.find(filterQuery).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
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
// C. SINGLE PRODUCT FETCH BY ID/SLUG (GET)
// ============================================
export const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Target product tracking match not found",
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
// D. UPDATE PRODUCT DETAILS METRICS (PUT)
// ============================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price ? Number(req.body.price) : undefined,
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : null,
      category: req.body.category,
      subcategory: req.body.subcategory,
      styleType: req.body.styleType, 
      productType: req.body.productType,
      status: req.body.status,
    };

    if (req.body.sizes) {
      try {
        allowedFields.sizes =
          typeof req.body.sizes === "string"
            ? JSON.parse(req.body.sizes)
            : req.body.sizes;
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid sizes parsing layout schema format",
        });
      }
    }

    Object.keys(allowedFields).forEach(
      (key) =>
        (allowedFields[key] === undefined || allowedFields[key] === "") &&
        delete allowedFields[key]
    );

    const product = await Product.findByIdAndUpdate(
      id,
      allowedFields,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No document match tracked for dataset upgrade registry",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product records synchronized successfully",
      product,
    });

  } catch (error) {
    console.log("🔥 PRODUCT UPDATE ENGINE EXCEPTION CRASH =>", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// E. REMOVE PRODUCT ENTIRELY (DELETE)
// ============================================
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Target document registry index match failed",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product and matching identifiers wiped from tracking collections",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};