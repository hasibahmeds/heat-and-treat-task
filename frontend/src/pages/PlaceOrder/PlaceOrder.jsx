import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        alert("Order Placed Successfully! (Cash on Delivery)");
        navigate("/myorders");
      } else {
        alert("Error placing order");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  // ---------------- SSLCommerz Online Payment ----------------
  const placeOnlinePaymentOrder = async (e) => {
    e.preventDefault();

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
        alert("Payment initialization failed!");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
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
  <button type="submit" className="cod-btn">
    Cash on Delivery
  </button>

<button
  type="button"
  className="online-btn"
  onClick={placeOnlinePaymentOrder}
>
  Online Payment
</button>
</div>
          </div>
          {/* <button type="submit">PLACE ORDER</button> */}
        </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
