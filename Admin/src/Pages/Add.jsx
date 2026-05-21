import React, { useState, useEffect } from "react";
import Navbar from "../Compontent/Navbar";
import Sidebar from "../Compontent/Sidebar";
import uploadIcon from "../assets/upload.avif";

export default function AddProduct() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ============================================
  // IMAGES
  // ============================================
  const [previews, setPreviews] = useState([null, null, null]);
  const [files, setFiles] = useState([null, null, null]);

  // ============================================
  // PRODUCT STATE
  // ============================================
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "",
    subcategory: "",
    productType: "normal",
    status: "normal",
    sizes: [{ size: "", stock: "" }],
  });

  // ============================================
  // CLEANUP
  // ============================================
  useEffect(() => {
    return () =>
      previews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
  }, [previews]);

  // ============================================
  // IMAGE CHANGE
  // ============================================
  const handleFileChange = (i, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFiles((prev) => {
      const copy = [...prev];
      copy[i] = file;
      return copy;
    });

    setPreviews((prev) => {
      const copy = [...prev];
      if (copy[i]) URL.revokeObjectURL(copy[i]);
      copy[i] = URL.createObjectURL(file);
      return copy;
    });
  };

  // ============================================
  // INPUT CHANGE
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================
  // SIZE SYSTEM
  // ============================================
  const handleSizeChange = (index, field, value) => {
    const updated = [...product.sizes];
    updated[index][field] = value;

    setProduct((prev) => ({
      ...prev,
      sizes: updated,
    }));
  };

  const addSize = () => {
    setProduct((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", stock: "" }],
    }));
  };

  const removeSize = (index) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  // ============================================
  // SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files[0] && !files[1] && !files[2]) {
      alert("Please upload at least 1 image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("oldPrice", product.oldPrice);
      formData.append("category", product.category);
      formData.append("subcategory", product.subcategory);
      formData.append("productType", product.productType);
      formData.append("status", product.status);

      formData.append("size", JSON.stringify(product.sizes));

      if (files[0]) formData.append("image1", files[0]);
      if (files[1]) formData.append("image2", files[1]);
      if (files[2]) formData.append("image3", files[2]);

      const res = await fetch("http://localhost:8030/api/product/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Product Added Successfully!");

        setProduct({
          name: "",
          description: "",
          price: "",
          oldPrice: "",
          category: "",
          subcategory: "",
          productType: "normal",
          status: "normal",
          sizes: [{ size: "", stock: "" }],
        });

        setFiles([null, null, null]);
        setPreviews([null, null, null]);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 md:ml-[260px] ml-0">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="pt-[70px] px-4 md:px-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Add Product
          </h2>

          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-5xl mx-auto">

            {/* IMAGES */}
            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              Upload Images
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[0, 1, 2].map((i) => (
                <label
                  key={i}
                  className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition rounded-xl w-full h-32 flex items-center justify-center bg-gray-50"
                >
                  {previews[i] ? (
                    <img
                      src={previews[i]}
                      className="w-20 h-20 object-cover rounded shadow"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <img src={uploadIcon} className="w-10 h-10 opacity-70" />
                      <span className="text-xs mt-1">Upload</span>
                    </div>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(i, e)}
                  />
                </label>
              ))}
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  className="border rounded-lg px-4 py-2 flex-1"
                  name="name"
                  placeholder="Product Name"
                  value={product.name}
                  onChange={handleChange}
                />

                <input
                  className="border rounded-lg px-4 py-2 flex-1"
                  name="price"
                  placeholder="Price"
                  value={product.price}
                  onChange={handleChange}
                />
              </div>

              <input
                className="border rounded-lg px-4 py-2"
                name="oldPrice"
                placeholder="Old Price"
                value={product.oldPrice}
                onChange={handleChange}
              />

              <textarea
                className="border rounded-lg px-4 py-2"
                rows={4}
                name="description"
                placeholder="Description"
                value={product.description}
                onChange={handleChange}
              />

              {/* CATEGORY */}
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  className="border rounded-lg px-4 py-2 flex-1"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="accessories">Accessories</option>
                </select>

                <input
                  className="border rounded-lg px-4 py-2 flex-1"
                  name="subcategory"
                  placeholder="Subcategory"
                  value={product.subcategory}
                  onChange={handleChange}
                />
              </div>

              {/* PRODUCT TYPE */}
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  className="border rounded-lg px-4 py-2 flex-1"
                  name="productType"
                  value={product.productType}
                  onChange={handleChange}
                >
                  <option value="normal">Normal</option>
                  <option value="featured">Featured</option>
                  <option value="trending">Trending</option>
                </select>
              </div>

              {/* STATUS */}
              <select
                className="border rounded-lg px-4 py-2"
                name="status"
                value={product.status}
                onChange={handleChange}
              >
                <option value="normal">Normal</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
                <option value="sold">Sold</option>
              </select>

              {/* SIZES */}
              <div className="border p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h3>Sizes</h3>
                  <button type="button" onClick={addSize} className="text-blue-500">
                    + Add
                  </button>
                </div>

                {product.sizes.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <select
                      className="border rounded px-2 py-1 flex-1"
                      value={s.size}
                      onChange={(e) =>
                        handleSizeChange(i, "size", e.target.value)
                      }
                    >
                      <option value="">Size</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>

                    <input
                      className="border rounded px-2 py-1 flex-1"
                      placeholder="Stock"
                      value={s.stock}
                      onChange={(e) =>
                        handleSizeChange(i, "stock", e.target.value)
                      }
                    />

                    <button
                      type="button"
                      onClick={() => removeSize(i)}
                      className="text-red-500"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4">
                Add Product
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}