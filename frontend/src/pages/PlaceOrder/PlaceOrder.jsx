







































// PlaceOrder.jsx
import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DELIVERY_AREAS } from "../../utils/deliveryAreas";   // ← new

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    deliveryArea: "",           // ← new
  });

  const [selectedCharge, setSelectedCharge] = useState(0);   // ← new

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));

    // When delivery area changes → update fee
    if (name === "deliveryArea") {
      const area = DELIVERY_AREAS.find((a) => a.name === value);
      setSelectedCharge(area ? area.charge : 0);
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  const generateOrderItems = () => {
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });
    return orderItems;
  };

  const totalAmount = getTotalCartAmount() + selectedCharge;

  // ────────────────────────────────────────
  //        CASH ON DELIVERY
  // ────────────────────────────────────────
  const placeCODOrder = async (e) => {
    e.preventDefault();

    if (!data.deliveryArea) {
      toast.error("Please select a delivery area");
      return;
    }

    const orderData = {
      address: { ...data, deliveryArea: data.deliveryArea },
      items: generateOrderItems(),
      amount: totalAmount,
      deliveryCharge: selectedCharge,     // ← new field
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success("Order Placed Successfully!");
        setCartItems({});                   // ← clear cart in context
        localStorage.removeItem("cartItems"); // optional
        navigate("/myorders");
      } else {
        toast.error(response.data.message || "Error placing order");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  // ────────────────────────────────────────
  //        ONLINE PAYMENT (SSL)
  // ────────────────────────────────────────
  const placeOnlinePaymentOrder = async (e) => {
    e.preventDefault();

    if (!data.deliveryArea) {
      toast.error("Please select a delivery area");
      return;
    }

    const orderItems = generateOrderItems();

    try {
      const response = await axios.post(
        `${url}/api/order/ssl-init`,
        {
          amount: totalAmount,
          customer: data,
          items: orderItems,
          deliveryCharge: selectedCharge,     // ← pass it
          deliveryArea: data.deliveryArea,    // ← pass it
        },
        { headers: { token } }
      );

      const gatewayUrl = response.data?.GatewayPageURL || response.data?.url;
      if (gatewayUrl) {
        window.location.href = gatewayUrl;
      } else {
        toast.error("Payment gateway error");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="place-order-page">
      <form className="place-order" onSubmit={placeCODOrder}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>

          <div className="multi-fields">
            <input name="firstName" value={data.firstName} onChange={onChangeHandler} placeholder="First Name" required />
            <input name="lastName"  value={data.lastName}  onChange={onChangeHandler} placeholder="Last Name"  required />
          </div>

          <input name="email"     value={data.email}     onChange={onChangeHandler} placeholder="Email Address" required type="email" />
          <textarea className="address-textarea" name="address" value={data.address} onChange={onChangeHandler} placeholder="Address (House, Road, etc)" required />

          {/* ─── Delivery Area Select ─── */}
          <select
            name="deliveryArea"
            value={data.deliveryArea}
            onChange={onChangeHandler}
            required
            className="delivery-area-select"
          >
            <option value="">Select Delivery Area</option>
            {DELIVERY_AREAS.map((area) => (
              <option key={area.name} value={area.name}>
                {area.name} (৳{area.charge})
              </option>
            ))}
          </select>

          <input name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Phone" required />

        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>{getTotalCartAmount()} TK</p>
              </div>
              <hr className="hr" />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>{selectedCharge} TK</p>
              </div>
              <hr className="hr" />
              <div className="cart-total-details">
                <b>Total</b>
                <b>{totalAmount} TK</b>
              </div>

              <div className="payment-buttons">
                <button type="submit" className="cod-btn">
                  Cash on Delivery
                </button>
                <button type="button" className="online-btn" onClick={placeOnlinePaymentOrder}>
                  Online Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* map ... */}
          {/* ---------------- DELIVERY ZONE MAP ---------------- */}
      {/* <div className="cart-map">
        <p className="map-text">
          Before checkout, Please ensure the delivery zone.
        </p>

        <div className="map-wrapper">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=10GBM7v23KfBnAifAOFeHJ36LFdgu5nA&ehbc=2E312F"
            width="640"
            height="480"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div> */}
    </div>
  );
};

export default PlaceOrder;