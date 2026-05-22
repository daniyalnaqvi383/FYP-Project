import './App.css'
import Hero from './Component/Hero/Hero';
import Login from './Component/Login/Login';
import Navbar from './Component/Navbar/Navbar';
import SignUP from './Component/Sign/signUP';
import { Route, Routes } from "react-router-dom";
import ProductDetail from './Pages/ProductDetail';
import Cartpage from './Pages/Cartpage';
import Checkout from './Pages/Checkout';
import OrderConfirmation from './Pages/OrderConfirmation';
import ProductGrid from './Pages/ProductGrid';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<SignUP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail/>} />
         <Route path="/CartPage" element={<Cartpage/>} />
         <Route path="/Checkout" element={<Checkout/>} />
         <Route path="/shop" element={<ProductGrid />} />
         <Route path="/order-confirmation" element={<OrderConfirmation />} />





      </Routes>
    </>
  );
}

export default App; 
