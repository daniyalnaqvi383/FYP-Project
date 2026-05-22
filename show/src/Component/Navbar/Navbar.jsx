import React, { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, Search, User, Plus, Minus, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, openCart, closeCart, addToCart } from "../../redux/cartSlice.js";
import CartPage from "../../Pages/Cartpage.jsx";
import Checkout from "../../Pages/Checkout.jsx";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // ✅ MOBILE DROPDOWN STATE (ADDED ONLY)
  const [mobileDropdown, setMobileDropdown] = useState("");

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

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

          <button className="md:hidden p-2" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#C19A6B] p-1.5 rounded-lg">
              <ShoppingCart size={18} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">Me</span>
          </Link>

          {/* MENU */}
<div className="hidden md:flex items-center space-x-8 font-medium text-gray-800 relative">

  <Link
  to="/"
  className="relative group transition duration-300 hover:text-[#C19A6B]"
>
  Home

  {/* underline animation */}
  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#C19A6B] transition-all duration-300 group-hover:w-full"></span>
</Link>

  {/* MEN */}
  <div className="relative group">
    <button className="flex items-center gap-1 hover:text-[#C19A6B] transition">
      Men
      <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
    </button>

    <div className="absolute top-10 left-0 w-64 bg-white shadow-2xl rounded-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">

      <div className="mb-5">
        <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm tracking-wider">
          Eastern
        </h3>

        <Link to="/men/kurta" className="block py-2 text-gray-600 hover:text-[#C19A6B]">
          Men Kurta
        </Link>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm tracking-wider">
          Western
        </h3>

        <Link to="/men/polo" className="block py-2 text-gray-600 hover:text-[#C19A6B]">
          Men Polo
        </Link>
        <Link to="/men/shirt" className="block py-2 text-gray-600 hover:text-[#C19A6B]">
          Men Shirt
        </Link>
        <Link to="/men/jeans" className="block py-2 text-gray-600 hover:text-[#C19A6B]">
          Men Jeans
        </Link>
      </div>

    </div>
  </div>

  {/* WOMEN */}
  <div className="relative group">
    <button className="flex items-center gap-1 hover:text-[#C19A6B] transition">
      Women
      <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
    </button>

    <div className="absolute top-10 left-0 w-64 bg-white shadow-2xl rounded-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">

      <div className="mb-5">
        <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm tracking-wider">
          Eastern
        </h3>

        <Link to="/women/suit" className="block py-2 text-gray-600 hover:text-[#C19A6B]">
          Women Suit
        </Link>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm tracking-wider">
          Western
        </h3>

        <Link to="/women/polo" className="block py-2 text-gray-600 hover:text-[#C19A6B]">
          Women Polo
        </Link>
        <Link to="/women/shirt" className="block py-2 text-gray-600 hover:text-[#C19A6B]">
          Women Shirt
        </Link>
      </div>

    </div>
  </div>

  {/* KIDS */}
  <div className="relative group">
    <button className="flex items-center gap-1 hover:text-[#C19A6B] transition">
      Kids
      <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
    </button>

    <div className="absolute top-10 left-0 w-56 bg-white shadow-2xl rounded-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">

      <Link to="/kids/boys" className="block py-2 text-gray-600 hover:text-[#C19A6B]">
        Boys Collection
      </Link>
      <Link to="/kids/girls" className="block py-2 text-gray-600 hover:text-[#C19A6B]">
        Girls Collection
      </Link>
      

    </div>
  </div>

  {/* SALE */}
  <Link to="/sale" className="text-red-500 font-semibold hover:text-red-600 transition">
    Sales
  </Link>

  {/* RETURN */}
  <Link to="/return-exchange" className="hover:text-[#C19A6B] transition">
    Return & Exchange
  </Link>

</div>

          {/* ICONS (UNCHANGED) */}
          <div className="flex items-center space-x-3 md:space-x-5">
            <div className="relative hidden sm:block">
              <button onClick={() => setShowSearch(!showSearch)}>
                <Search size={22} />
              </button>
            </div>

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
                </div>
              )}
            </div>

            <button onClick={() => dispatch(openCart())}>
              <ShoppingCart size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* CART (UNCHANGED) */}
      {/* ❌ skipped for brevity (your same code) */}

      {/* 📱 MOBILE MENU (UPDATED ONLY HERE) */}
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

            {/* MEN */}
            <div>
              <button
                onClick={() =>
                  setMobileDropdown(mobileDropdown === "men" ? "" : "men")
                }
                className="flex items-center justify-between w-full font-medium"
              >
                Men
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    mobileDropdown === "men" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileDropdown === "men" && (
                <div className="pl-3 mt-2 flex flex-col gap-2 text-sm">
                  <p className="font-semibold">Eastern</p>
                  <Link to="/men/kurta" onClick={() => setIsOpen(false)}>Kurta</Link>

                  <p className="font-semibold mt-2">Western</p>
                  <Link to="/men/polo" onClick={() => setIsOpen(false)}>Polo</Link>
                  <Link to="/men/shirt" onClick={() => setIsOpen(false)}>Shirt</Link>
                  <Link to="/men/jeans" onClick={() => setIsOpen(false)}>Jeans</Link>
                </div>
              )}
            </div>

            {/* WOMEN */}
            <div>
              <button
                onClick={() =>
                  setMobileDropdown(mobileDropdown === "women" ? "" : "women")
                }
                className="flex items-center justify-between w-full font-medium"
              >
                Women
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    mobileDropdown === "women" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileDropdown === "women" && (
                <div className="pl-3 mt-2 flex flex-col gap-2 text-sm">
                  <p className="font-semibold">Eastern</p>
                  <Link to="/women/suit" onClick={() => setIsOpen(false)}>Suit</Link>

                  <p className="font-semibold mt-2">Western</p>
                  <Link to="/women/polo" onClick={() => setIsOpen(false)}>Polo</Link>
                  <Link to="/women/shirt" onClick={() => setIsOpen(false)}>Shirt</Link>
                </div>
              )}
            </div>

            {/* KIDS */}
            <div>
              <button
                onClick={() =>
                  setMobileDropdown(mobileDropdown === "kids" ? "" : "kids")
                }
                className="flex items-center justify-between w-full font-medium"
              >
                Kids
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    mobileDropdown === "kids" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileDropdown === "kids" && (
                <div className="pl-3 mt-2 flex flex-col gap-2 text-sm">
                  <Link to="/kids/boys" onClick={() => setIsOpen(false)}>Boys</Link>
                  <Link to="/kids/girls" onClick={() => setIsOpen(false)}>Girls</Link>
                  <Link to="/kids/newborn" onClick={() => setIsOpen(false)}>New Born</Link>
                </div>
              )}
            </div>

            <Link to="/sale" onClick={() => setIsOpen(false)} className="text-red-500">
              Sale
            </Link>

            <Link to="/return-exchange" onClick={() => setIsOpen(false)}>
              Return & Exchange
            </Link>

          </div>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;