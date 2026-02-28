import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { useState, useEffect } from "react";
import MyOrders from "./pages/MyOrders/MyOrders";
import Invoice from "./pages/Invoice/Invoice";

// 🔥 Toast imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  const [showLogin,setShowLogin] = useState(false)

  // 🔥 NEW: Listen for checkout login trigger
  useEffect(() => {
    const openLogin = () => setShowLogin(true);
    window.addEventListener("openLogin", openLogin);

    return () => {
      window.removeEventListener("openLogin", openLogin);
    };
  }, []);

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin}  />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/invoice" element={<Invoice />} />
        </Routes>
      </div>
      <Footer />

      {/* 🔥 Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default App;
