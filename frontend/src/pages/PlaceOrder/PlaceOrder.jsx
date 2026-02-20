import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🔥 Toast imports
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // street: "",
    address: "",
    city: "",
    // district: "",
    phone: ""
  });

  // 🔥 NEW: Loading states (Added only this)
  const [loadingCOD, setLoadingCOD] = useState(false);
  const [loadingOnline, setLoadingOnline] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, navigate, getTotalCartAmount]);

  const generateOrderItems = () => {
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });
    return orderItems;
  };

  // ---------------- COD ----------------
  const placeCODOrder = async (e) => {
    e.preventDefault();
    setLoadingCOD(true); // 🔥 Start loading

    const orderData = {
      address: data,
      items: generateOrderItems(),
      amount: getTotalCartAmount() + 40, // delivery charge
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Order Placed Successfully!"); // 🔥 toast message
        navigate("/myorders");
      } else {
        toast.error("Error placing order"); // 🔥 toast message
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!"); // 🔥 toast message
    } finally {
      setLoadingCOD(false); // 🔥 Stop loading
    }
  };

  // ---------------- SSLCommerz Online Payment ----------------
  const placeOnlinePaymentOrder = async (e) => {
    e.preventDefault();
    setLoadingOnline(true); // 🔥 Start loading

    const orderItems = generateOrderItems();
    const totalAmount = getTotalCartAmount() + 40;

    try {
      // Backend endpoint to initialize SSLCommerz (include auth token)
      const response = await axios.post(
        `${url}/api/order/ssl-init`,
        {
          amount: totalAmount,
          currency: "BDT",
          customer: data,
          items: orderItems,
        },
        { headers: { token } }
      );

      console.log("SSL INIT RESPONSE (frontend):", response.data);

      const gatewayUrl = response.data?.GatewayPageURL || response.data?.url;

      if (gatewayUrl) {
        // Redirect user to SSLCommerz payment page
        window.location.href = gatewayUrl;
      } else {
        toast.error("Payment initialization failed!"); // 🔥 toast message
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!"); // 🔥 toast message
    } finally {
      setLoadingOnline(false); // 🔥 Stop loading
    }
  };

  return (
    <div className="place-order-page">
      <form className="place-order" onSubmit={placeCODOrder}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
            <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
          </div>
          <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email Address" />
          {/* <textarea className="address-textarea" required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" /> */}
          <textarea className="address-textarea" required name="address" onChange={onChangeHandler} value={data.address} type="text" placeholder="Address" />
          <div className="multi-fields">
            <textarea className="address-textarea" required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
            {/* <textarea className="address-textarea" required name="district" onChange={onChangeHandler} value={data.district} type="text" placeholder='District' /> */}
          </div>
          <div className="multi-fields">
            {/* <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' /> */}
            {/* <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' /> */}
          </div>
          <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
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
                <p>{getTotalCartAmount() === 0 ? 0 : 40} TK</p>    {/* delivery charge at the 3rd end 0 */}
              </div>
              <hr className="hr" />
              <div className="cart-total-details">
                <b>Total</b>
                <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40} TK</b>   {/* delivery charge at the end 0 */}
              </div>
              <div className="payment-buttons">
                <button type="submit" className="cod-btn" disabled={loadingCOD}>
                  {loadingCOD ? "Placing Order..." : "Cash on Delivery"}
                </button>

                <button
                  type="button"
                  className="online-btn"
                  onClick={placeOnlinePaymentOrder}
                  disabled={loadingOnline}
                >
                  {loadingOnline ? "Processing..." : "Online Payment"}
                </button>
              </div>
            </div>
            {/* <button type="submit">PLACE ORDER</button> */}
          </div>
        </div>
      </form>

      {/* ---------------- DELIVERY ZONE MAP ---------------- */}
      <div className="cart-map">
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
      </div>
    </div>
  );
};

export default PlaceOrder;
