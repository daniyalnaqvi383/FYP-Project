import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart, openCart } from "../redux/cartSlice.js"; // Apna actual path lagayein

export default function ProductGrid() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL query parameters read karne ke liye React Router ka hook
  const [searchParams, setSearchParams] = useSearchParams();

  // URL se initial states uthana (agar navbar se user filter daba kar aaye)
  const categoryParam = searchParams.get("category") || "";
  const styleParam = searchParams.get("styleType") || "";
  const subcatParam = searchParams.get("subcategory") || "";
  const typeParam = searchParams.get("productType") || "";

  // ============================================
  // FETCH PRODUCTS MATRIX
  // ============================================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Backend universal link build up logic using URLSearchParams object directly
      let queryUrl = `http://localhost:8030/api/product?${searchParams.toString()}`;

      const res = await fetch(queryUrl);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }
      setLoading(false);
    } catch (error) {
      console.error("Matrix compilation lookup crash:", error);
      setLoading(false);
    }
  };

  // Jab bhi URL ke query parameters badlenge, yeh fetch function dobara chalega
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  // ============================================
  // FILTER TOGGLE HANDLERS (URL UPDATERS)
  // ============================================
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "") {
      newParams.delete(key); // Agar 'All' select kiya toh key drop kar do
    } else {
      newParams.set(key, value);
    }
    // Subcategory ko reset karna zaroori hai agar main category change ho rahi ho
    if (key === "category") {
      newParams.delete("subcategory");
    }
    setSearchParams(newParams);
  };

  // ============================================
  // DISPATCH TO REDUX CART
  // ============================================
  const handleAddToCart = (e, item) => {
    e.preventDefault();
    dispatch(
      addToCart({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.images?.[0],
        size: item.sizes?.[0]?.size || "M",
        quantity: 1,
      })
    );
    dispatch(openCart());
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ============================================
            LEFT SIDE: STRUCTURAL FILTERS RADIAL PANEL
           ============================================ */}
        <div className="w-full lg:w-[250px] shrink-0 border-r border-gray-100 pr-4">
          <h3 className="text-lg font-bold text-gray-800 mb-6 tracking-wide uppercase">
            Filters
          </h3>
          
          {/* 1. CLOTHING STYLE TYPE FILTER */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider text-xs">
              Product Style
            </h4>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input 
                  type="radio" 
                  name="styleType" 
                  checked={styleParam === ""} 
                  onChange={() => handleFilterChange("styleType", "")} 
                  className="accent-[#C19A6B] w-4 h-4" 
                /> All Styles
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input 
                  type="radio" 
                  name="styleType" 
                  checked={styleParam === "eastern"} 
                  onChange={() => handleFilterChange("styleType", "eastern")} 
                  className="accent-[#C19A6B] w-4 h-4" 
                /> Eastern Wear
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input 
                  type="radio" 
                  name="styleType" 
                  checked={styleParam === "western"} 
                  onChange={() => handleFilterChange("styleType", "western")} 
                  className="accent-[#C19A6B] w-4 h-4" 
                /> Western Wear
              </label>
            </div>
          </div>

          {/* 2. CATEGORY FILTER */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider text-xs">
              Category
            </h4>
            <div className="flex flex-col gap-2">
              {["", "men", "women", "kids", "accessories"].map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer capitalize">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={categoryParam === cat} 
                    onChange={() => handleFilterChange("category", cat)} 
                    className="accent-[#C19A6B] w-4 h-4" 
                  /> {cat === "" ? "All Categories" : cat}
                </label>
              ))}
            </div>
          </div>

          {/* Active Subcategory Feedback Badge Indicator */}
          {subcatParam && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
              <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider block mb-1">Active Tag:</span>
              <span className="text-sm bg-amber-700 text-white px-2 py-0.5 rounded capitalize font-medium">{subcatParam}</span>
              <button 
                onClick={() => handleFilterChange("subcategory", "")}
                className="text-xs text-red-500 block mt-2 hover:underline font-semibold"
              >
                Clear Subcategory
              </button>
            </div>
          )}
        </div>

        {/* ============================================
            RIGHT SIDE: RESPONSE PRODUCT IMAGE GRID 
           ============================================ */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-24 text-gray-500 font-medium text-lg">
              Loading Products Gallery...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {products.map((item) => (
                <div key={item._id} className="group relative flex flex-col justify-between">
                  
                  {/* Link wrapper hitting target detail route parsing parameters */}
                  <Link to={`/product/${item._id}`} className="block">
                    
                    {/* IMAGE RENDER HOUSING CONTAINER */}
                    <div className="relative overflow-hidden bg-gray-50 rounded-xl aspect-[3/4]">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      
                      {/* Interactive floating cart layer dispatcher button trigger */}
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="absolute bottom-3 right-3 bg-white text-black p-3 rounded-full shadow-lg opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#C19A6B] hover:text-white"
                      >
                        <AiOutlineShoppingCart className="text-lg" />
                      </button>
                    </div>

                    {/* CARD INFO BLOCK DETAILS */}
                    <div className="mt-4">
                      <p className="text-[11px] text-[#C19A6B] uppercase font-bold tracking-widest mb-1">
                        {item.styleType} Wear
                      </p>
                      <h3 className="text-sm text-gray-800 font-medium mb-1 truncate group-hover:text-[#C19A6B] transition">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-gray-900">
                          Rs {item.price.toLocaleString()}
                        </span>
                        {item.oldPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            Rs {item.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                  </Link>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-gray-400 font-medium">
              No articles match your requested criteria filters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}