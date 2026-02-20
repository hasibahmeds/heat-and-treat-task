// PlaceOrder.jsx
import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const deliveryAreas = [
  { name: "Motijheel",    charge: 50 },
  { name: "Shahbag",      charge: 40 },
  { name: "Dhanmondi",    charge: 30 },
  { name: "Farmgate",     charge: 30 },
  { name: "Agargaon",     charge: 40 },
  { name: "Mohammadpur",  charge: 50 },
  { name: "Mirpur",       charge: 50 },
  { name: "Gulshan",      charge: 60 },   // corrected spelling
  { name: "Banani",       charge: 60 },
  { name: "Uttara",       charge: 70 },
];

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    deliveryArea: "",           // ← new
  });

  const [selectedDelivery, setSelectedDelivery] = useState(null);  // object or null

  const [loadingCOD, setLoadingCOD]     = useState(false);
  const [loadingOnline, setLoadingOnline] = useState(false);

  const deliveryCharge = selectedDelivery?.charge || 0;
  const subtotal = getTotalCartAmount();
  const totalAmount = subtotal + deliveryCharge;

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));

    if (name === "deliveryArea") {
      const area = deliveryAreas.find(a => a.name === value);
      setSelectedDelivery(area || null);
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, navigate, getTotalCartAmount]);

  const generateOrderItems = () => {
    return food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({ ...item, quantity: cartItems[item._id] }));
  };

  // ── CASH ON DELIVERY ──
  const placeCODOrder = async (e) => {
    e.preventDefault();
    if (!selectedDelivery) {
      toast.error("Please select a delivery area");
      return;
    }

    setLoadingCOD(true);

    const orderData = {
      address: { ...data, deliveryArea: selectedDelivery.name },
      items: generateOrderItems(),
      amount: totalAmount,
      deliveryCharge: deliveryCharge,     // ← send explicitly
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Order Placed Successfully!");
        setCartItems({});                    // clear cart in context
        localStorage.removeItem("cartItems"); // optional extra safety
        navigate("/myorders");
      } else {
        toast.error(response.data.message || "Error placing order");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoadingCOD(false);
    }
  };

  // ── ONLINE PAYMENT (SSLCommerz) ──
  const placeOnlinePaymentOrder = async (e) => {
    e.preventDefault();
    if (!selectedDelivery) {
      toast.error("Please select a delivery area");
      return;
    }

    setLoadingOnline(true);

    const orderItems = generateOrderItems();

    try {
      const response = await axios.post(
        `${url}/api/order/ssl-init`,
        {
          amount: totalAmount,
          customer: data,
          items: orderItems,
          deliveryCharge: deliveryCharge,
          deliveryArea: selectedDelivery.name,
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
    } finally {
      setLoadingOnline(false);
    }
  };

  return (
    <div className="place-order-page">
      <form className="place-order" onSubmit={placeCODOrder}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input required name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First Name" />
            <input required name="lastName"  onChange={onChangeHandler} value={data.lastName}  placeholder="Last Name" />
          </div>
          <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email Address" />
          <textarea required name="address" onChange={onChangeHandler} value={data.address} placeholder="Address (House, Road, Block)" className="address-textarea" />

          {/* ── Delivery Area SELECT ── */}
          <select
            required
            name="deliveryArea"
            onChange={onChangeHandler}
            value={data.deliveryArea}
            className="delivery-area-select"
          >
            <option value="">Select Delivery Area</option>
            {deliveryAreas.map(area => (
              <option key={area.name} value={area.name}>
                {area.name} (৳{area.charge})
              </option>
            ))}
          </select>

          <input required name="phone" onChange={onChangeHandler} value={data.phone} placeholder="Phone" />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>{subtotal} TK</p>
              </div>
              <hr className="hr" />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>{deliveryCharge} TK</p>
              </div>
              <hr className="hr" />
              <div className="cart-total-details">
                <b>Total</b>
                <b>{totalAmount} TK</b>
              </div>

              <div className="payment-buttons">
                <button type="submit" className="cod-btn" disabled={loadingCOD}>
                  {loadingCOD ? "Placing..." : "Cash on Delivery"}
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
          </div>
        </div>
      </form>

      {/* Map remains the same */}
    </div>
  );
};

export default PlaceOrder;