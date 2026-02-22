      {/* ---------------- DELIVERY ZONE MAP ---------------- */}
      // <div className="cart-map">
      //   <p className="map-text">
      //     Before checkout, Please ensure the delivery zone.
      //   </p>

      //   <div className="map-wrapper">
      //     <iframe
      //       src="https://www.google.com/maps/d/embed?mid=10GBM7v23KfBnAifAOFeHJ36LFdgu5nA&ehbc=2E312F"
      //       width="640"
      //       height="480"
      //       referrerPolicy="no-referrer-when-downgrade"
      //     ></iframe>
      //   </div>
      // </div>














      import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const deliveryAreas = [
  { name: "Motijheel",    fee: 50 },
  { name: "Shahbag",      fee: 40 },
  { name: "Dhanmondi",    fee: 30 },
  { name: "Farmgate",     fee: 30 },
  { name: "Agargaon",     fee: 40 },
  { name: "Mohammadpur",  fee: 50 },
  { name: "Mirpur",       fee: 50 },
  { name: "Gulshan",      fee: 60 },
  { name: "Banani",       fee: 60 },
  { name: "Uttara",       fee: 70 },
];

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: ""
  });

  const [selectedArea, setSelectedArea] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [loadingCOD, setLoadingCOD] = useState(false);
  const [loadingOnline, setLoadingOnline] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "deliveryArea") {
      setSelectedArea(value);
      const areaObj = deliveryAreas.find(a => a.name === value);
      setDeliveryFee(areaObj ? areaObj.fee : 0);
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  const prepareOrderItems = () => {
    return food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({ ...item, quantity: cartItems[item._id] }));
  };

  const placeCashOnDeliveryOrder = async (e) => {
    e.preventDefault();
    if (!selectedArea) return toast.error("Please select delivery area");

    setLoadingCOD(true);

    const orderPayload = {
      address: { ...formData, deliveryArea: selectedArea },
      items: prepareOrderItems(),
      amount: getTotalCartAmount() + deliveryFee
    };

    try {
      const res = await axios.post(`${url}/api/order/place`, orderPayload, { headers: { token } });
      if (res.data.success) {
        toast.success("Order placed successfully!");
        setCartItems({}); // Clear cart in context
        navigate("/myorders");
      } else {
        toast.error(res.data.message || "Order placement failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoadingCOD(false);
    }
  };

  const initiateOnlinePayment = async () => {
    if (!selectedArea) return toast.error("Please select delivery area");

    setLoadingOnline(true);
    // toast.info("Redirecting to payment gateway...", { autoClose: 3000 });

    const payload = {
      amount: getTotalCartAmount() + deliveryFee,
      currency: "BDT",
      customer: { ...formData, deliveryArea: selectedArea },
      items: prepareOrderItems()
    };

    try {
      const res = await axios.post(`${url}/api/order/ssl-init`, payload, { headers: { token } });
      const gateway = res.data?.GatewayPageURL || res.data?.url;
      if (gateway) {
        window.location.href = gateway;
      } else {
        toast.error("Payment gateway error");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoadingOnline(false);
    }
  };

  const subtotal = getTotalCartAmount();
  const total = subtotal + deliveryFee;

  return (
    <div className="place-order-page">
      <form className="place-order" onSubmit={placeCashOnDeliveryOrder}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>

          <div className="multi-fields">
            <input name="firstName"  value={formData.firstName}  onChange={handleInputChange} placeholder="First Name"  required />
            <input name="lastName"   value={formData.lastName}   onChange={handleInputChange} placeholder="Last Name"   required />
          </div>

          <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address" required />

          <textarea
            className="address-textarea"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address (House, Road, Area, etc)"
            required
          />

          <select
            name="deliveryArea"
            value={selectedArea}
            onChange={handleInputChange}
            required
            className="delivery-area-select"
          >
            <option value="">Select Delivery Area</option>
            {deliveryAreas.map(area => (
              <option key={area.name} value={area.name}>
                {area.name} - {area.fee} TK
              </option>
            ))}
          </select>

          <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" required />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Order Summary</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{subtotal} TK</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{deliveryFee} TK</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{total} TK</b>
            </div>

            <div className="payment-buttons">
              <button type="submit" className="cod-btn" disabled={loadingCOD}>
                {loadingCOD ? "Placing..." : "Cash on Delivery"}
              </button>
              <button type="button" className="online-btn" onClick={initiateOnlinePayment} disabled={loadingOnline}>
                {loadingOnline ? "Processing..." : "Online Payment"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;