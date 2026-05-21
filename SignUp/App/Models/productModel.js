import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
      default: null,
    },

    category: {
      type: String,
      enum: ["men", "women", "kids", "accessories"],
      required: true,
    },

    subcategory: {
      type: String,
      required: true,
    },

    productType: {
      type: String,
      enum: ["featured", "trending", "normal"],
      default: "normal",
    },

    status: {
      type: String,
      enum: ["new", "sale", "sold", "normal"],
      default: "new",
    },

    //  MULTIPLE IMAGES (CARD + DETAIL SUPPORT)
    images: {
      type: [String],
      required: true,
    },

    // SIZE SYSTEM
    sizes: [
      {
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
          required: true,
        },
        stock: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;