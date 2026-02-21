import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (!token) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        window.dispatchEvent(new Event("openLogin"));
      }, 800);
      return;
    }
    const totalAmount = getTotalCartAmount();
    if (totalAmount === 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 800);
      return;
    }
    navigate("/order");
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p><p>Title</p><p>Price</p><p>Quantity</p><p>Total</p><p>Remove</p>
        </div>
        <br />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-item">
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
                  <p onClick={() => removeFromCart(item._id)} className="cross">×</p>
                </div>
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
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>Calculated at checkout</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>Calculated at checkout</b>
          </div>
          <button onClick={handleCheckout} disabled={loading}>
            {loading ? "Loading..." : "CHECKOUT"}
          </button>
        </div>
      </div>

      {/* delivery zone map remains if you want */}
    </div>
  );
};

export default Cart;