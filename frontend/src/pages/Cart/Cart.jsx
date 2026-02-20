import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, token } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // 🔥 NEW: Loading state for checkout button
  const [loading, setLoading] = useState(false);

  // 🔥 NEW: Handle checkout with login check and empty cart check
  const handleCheckout = () => {
    if (!token) {
      // If user is not logged in
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        window.dispatchEvent(new Event("openLogin")); // open login popup
      }, 800);

      return;
    }

    // If cart is empty after login
    const totalAmount = getTotalCartAmount();
    if (totalAmount === 0) {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        navigate("/"); // redirect to home page
      }, 800);

      return;
    }

    // Normal checkout flow
    navigate("/order");
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        {/* <hr /> */}

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-item">
                  {/* FIXED IMAGE LOGIC BELOW */}
                  <img 
                    src={item.image.startsWith("http") ? item.image : `${url}/images/${item.image}`} 
                    alt={item.name} 
                  /> 
                  
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">{item.price} TK</p>
                  </div>

                  <p className="item-quantity">x{cartItems[item._id]}</p>

                  <p className="item-total">{item.price * cartItems[item._id]} TK</p>

                  <p
                    onClick={() => removeFromCart(item._id)}
                    className="cross"
                  >
                    ×
                  </p>
                </div>
                {/* <hr /> */}
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{getTotalCartAmount()} TK</p>
          </div>
          <hr />
          {/* <div className="cart-total-details">
            <p>Delivery Fee</p> */}
            {/* delivery charge at the 3rd end*/}
            {/* <p>{getTotalCartAmount() === 0 ? 0 : 40} TK</p>      */}
          {/* </div> */}
          {/* <hr /> */}
          {/* <div className="cart-total-details">
            <b>Total</b>
            <b>
              {getTotalCartAmount() === 0
                ? 0
                : getTotalCartAmount() + 40} TK */}
                {/* delivery charge at the end 40 */}     
            {/* </b>
          </div> */}

          {/* 🔥 Updated Checkout Button */}
          <button onClick={handleCheckout} disabled={loading}>
            {loading ? "Loading..." : "CHECKOUT"}
          </button>
        </div>
      </div>

      {/* ---------------- DELIVERY ZONE MAP ---------------- */}
      {/* <div className="cart-map">
        <p className="map-text">
          Before checkout, Please ensure the delivery zone.
        </p>

        <div className="map-wrapper">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=10GBM7v23KfBnAifAOFeHJ36LFdgu5nA&ehbc=2E312F" width="640" height="480"
            // loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div> */}

    </div>
  );
};

export default Cart;
