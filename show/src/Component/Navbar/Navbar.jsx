import React, { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, Search, User, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// Make sure these are exported in your cartSlice.js
import { removeFromCart, openCart, closeCart, addToCart } from "../../redux/cartSlice.js"; 
import CartPage from "../../Pages/Cartpage.jsx";
import Checkout from "../../Pages/Checkout.jsx";


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  // USER API
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setUser(null);
    try {
      const res = await axios.get("http://localhost:8030/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        localStorage.removeItem("token");
      }
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    const syncUser = () => fetchUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8030/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log(err);
    }
    localStorage.removeItem("token");
    setUser(null);
    setDropdown(false);
  };

  // HANDLERS FOR QUANTITY
  const handleIncreaseQuantity = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  const handleDecreaseQuantity = (index, currentQty) => {
    if (currentQty <= 1) {
      dispatch(removeFromCart(index));
    } else {
      dispatch({ type: "cart/decreaseQuantity", payload: index });
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">

      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between h-20 items-center">

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#C19A6B] p-1.5 rounded-lg">
              <ShoppingCart size={18} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">Me</span>
          </Link>

          {/* MENU */}
          <div className="hidden md:flex space-x-8 items-center font-medium text-gray-800">
            <Link to="/" className="text-[#C19A6B]">Home</Link>
            <Link to="/products">Shop</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/pages">Pages</Link>
            <Link to="/docs">Docs</Link>
          </div>

          {/* ICONS */}
          <div className="flex items-center space-x-3 md:space-x-5">

            {/* SEARCH */}
            <div className="relative hidden sm:block">
              <button onClick={() => setShowSearch(!showSearch)}>
                <Search size={22} />
              </button>
              {showSearch && (
                <input
                  className="absolute top-12 right-0 border px-4 py-2 rounded-full w-64 bg-white"
                  placeholder="Search..."
                />
              )}
            </div>

            {/* USER */}
            <div className="hidden md:block">
              {!user ? (
                <Link to="/signup"><User size={22} /></Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdown(!dropdown)}
                    className="w-8 h-8 bg-gray-800 text-white rounded-full"
                  >
                    {user.name?.charAt(0)}
                  </button>
                  {dropdown && (
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl p-2">
                      <p className="px-2 text-sm">{user.name}</p>
                      <button onClick={handleLogout} className="text-[#C19A6B] px-2 py-2">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CART ICON */}
            <button className="relative" onClick={() => dispatch(openCart())}>
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-[#C19A6B] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CART SIDEBAR */}
      <div
        className={`fixed inset-0 z-[100] ${isCartOpen ? "bg-black/50" : "hidden"}`}
        onClick={() => dispatch(closeCart())}
      >
        <div
          className={`fixed right-0 top-0 h-full w-[360px] bg-white flex flex-col transition-transform duration-300 ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* CART HEADER */}
          <div className="p-5 flex justify-between items-center border-b border-gray-100">
            <h1 className="text-lg font-medium tracking-wide uppercase text-gray-800">Cart</h1>
            <button className="text-gray-400 hover:text-black transition" onClick={() => dispatch(closeCart())}>
              <X size={20} />
            </button>
          </div>

          {/* CART ITEMS LIST (SCROLLABLE AREA) */}
          <div className="p-5 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            {cartItems.length === 0 ? (
              <p className="text-gray-400 text-center mt-8 text-sm">Your cart is currently empty.</p>
            ) : (
              cartItems.map((item, index) => {
                const itemQty = item.quantity || 1;
                return (
                  <div key={index} className="flex gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    {/* Product Image */}
                    <img src={item.image} className="w-20 h-24 object-cover bg-gray-50" alt={item.name} />
                    
                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-normal text-gray-800 tracking-tight leading-tight pr-4">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-1">Size: {item.size}</p>
                      </div>

                      {/* Counter Box and Price Row */}
                      <div className="flex items-center justify-between mt-2">
                        {/* EXACT SCREENSHOT MATCH QUANTITY SELECTOR */}
                        <div className="flex items-center border border-gray-200 h-7 rounded bg-white">
                          <button 
                            onClick={() => handleDecreaseQuantity(index, itemQty)}
                            className="px-2 text-gray-400 hover:text-black transition flex items-center justify-center h-full border-r border-gray-100"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-normal w-7 text-center select-none text-gray-800">
                            {itemQty}
                          </span>
                          <button 
                            onClick={() => handleIncreaseQuantity(item)}
                            className="px-2 text-gray-400 hover:text-black transition flex items-center justify-center h-full border-l border-gray-100"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xs font-medium text-gray-700">
                          Rs.{item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* TOTAL & CHECKOUT SECTION (PERMANENTLY LOCKED AT BOTTOM) */}
          <div className="w-full p-5 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            {cartItems.length > 0 && (
              <div className="flex justify-between mb-5 font-medium text-xs uppercase tracking-wider text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-800 font-semibold text-sm">Rs.{totalAmount.toFixed(0)}</span>
              </div>
            )}
            <Link to="/Checkout" onClick={() => dispatch(closeCart())}>
              <button className="w-full bg-black text-white py-3.5 font-medium tracking-widest text-xs uppercase transition duration-300 hover:bg-opacity-90">
                Check Out
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-black/50 md:hidden ${isOpen ? "visible" : "hidden"}`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`bg-white w-[280px] h-full p-5 transition-transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between mb-5">
            <h2 className="font-bold">Menu</h2>
            <X onClick={() => setIsOpen(false)} />
          </div>
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setIsOpen(false)}>Shop</Link>
            <Link to="/blog" onClick={() => setIsOpen(false)}>Blog</Link>
            <Link to="/pages" onClick={() => setIsOpen(false)}>Pages</Link>
            {!user && <Link to="/signup" onClick={() => setIsOpen(false)}>Signup</Link>}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;