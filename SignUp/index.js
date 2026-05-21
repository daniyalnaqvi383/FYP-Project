const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const signRoute = require("./App/Routes/Web/signRoutes.js");
const adminRoute = require("./App/Routes/Admin/AdminRoutes.js");
const { default: ProductRoutes } = require("./App/Routes/Admin/ProductRoutes.js");
const { default: orderRoutes } = require("./App/Routes/Admin/orderRoutes.js");

const app = express();

app.use(express.json());

// ✅ CORS setup for frontend (5173) and admin (5174)
app.use(
  cors({
origin: true,

    credentials: true,
  })
);

app.use("/api", signRoute);



// Admin 

app.use("/api/admin", adminRoute);


// product routes
app.use("/api/product",ProductRoutes)
app.use("/api/orders", orderRoutes);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
  });

module.exports = app;
