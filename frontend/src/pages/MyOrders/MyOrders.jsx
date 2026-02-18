// import { useContext, useEffect, useState } from 'react'
// import './MyOrders.css'
// import { StoreContext } from '../../context/StoreContext';
// import axios from 'axios';
// import { assets } from '../../assets/assets';  before not used
// import { BsBoxSeamFill } from "react-icons/bs";

// const MyOrders = () => {

//     const {url, token} = useContext(StoreContext);
//     const [data,setData] = useState([]);

//     const fetchOrders = async () =>{
//         const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
//         setData(response.data.data);

//     }

//     useEffect(()=>{
//         if (token) {
//             fetchOrders();
//         }
//     },[token])

//   return (
//     <div className='my-orders'>
//         <h2>My Orders</h2>
//         <div className="container">
//             {data.map((order,index)=>{
//                 return(
//                     <div key={index} className='my-orders-order'>
//                         {/* <img src={assets.parcel_icon} alt="" /> */}
//                         <BsBoxSeamFill className='box' />
//                         <p>{order.items.map((item,index)=>{
//                             if (index === order.items.length-1) {
//                                 return item.name+" x "+item.quantity
//                             }
//                             else{
//                                 return item.name+" x "+item.quantity+", "
//                             }
//                         })}</p>

//                         <p>{order.amount} TK</p>
//                         <p>Items:{order.items.length}</p>
//                         <p><span>&#x25cf;</span><b>{order.status}</b></p>
//                         <button onClick={fetchOrders}>Track Order</button>
//                     </div>
//                 )
//             })}
//         </div>
//     </div>
//   )
// }

// export default MyOrders







import { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { BsBoxSeamFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {

  const navigate = useNavigate();

  const openEmail = (e) => {
    e.preventDefault();
    const email = "tastecode.1525@gmail.com";

    // Check if user is on Mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `mailto:${email}`;
    } else {
      // Open Gmail Web in new tab for Desktop
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
        "_blank"
      );
    }
  };

  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // 🔥 NEW: Loading states
  const [loadingTrack, setLoadingTrack] = useState(null);
  const [loadingCancel, setLoadingCancel] = useState(null);

  const fetchOrders = async (orderId = null) => {
    if (orderId) setLoadingTrack(orderId);

    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );

    setData(response.data.data);
    setLoadingTrack(null);
  };

  // 🔥 Direct Cancel Status Update with Loading
  const statusHandler = async (orderId) => {
    setLoadingCancel(orderId);

    await axios.post(url + "/api/order/status", {
      orderId,
      status: "Cancelled",
    });

    await fetchOrders();
    setLoadingCancel(null);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {

          const canAccessInvoice =
            order.status === "Out for delivery" ||
            order.status === "Delivered";

          return (
            <div key={index} className="my-orders-order">
              <BsBoxSeamFill className="box" />
              <p>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>

              <p>{order.amount} TK</p>
              <p>Items:{order.items.length}</p>
              <p>
                <span>&#x25cf;</span>
                <b>{order.status}</b>
              </p>

              {/* 🔥 Track Order Button with Loading */}
              <button
                onClick={() => fetchOrders(order._id)}
                disabled={loadingTrack === order._id}
              >
                {loadingTrack === order._id ? "Tracking..." : "Track Order"}
              </button>

              {/* 🔥 Invoice Accessible Only After Delivery */}
              <button
                className="invoice-btn"
                disabled={!canAccessInvoice}
                style={!canAccessInvoice ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                onClick={() => canAccessInvoice && navigate("/invoice", { state: { order } })}
              >
                Invoice
              </button>

              {/* --- DROPDOWN CANCELLATION SECTION --- */}
              {order.status === "Food Processing" && (
                <details className="cancel-dropdown">
                  <summary>Cancel this order?</summary>
                  <div className="cancel-content">
                    <p className="hint">
                      Cancel option will be disabled within 15 minutes.
                    </p>

                    {/* 🔥 Confirm Cancel Button with Loading */}
                    <button
                      className="confirm-cancel-btn"
                      onClick={() => statusHandler(order._id)}
                      disabled={loadingCancel === order._id}
                    >
                      {loadingCancel === order._id ? "Cancelling..." : "Confirm Cancel"}
                    </button>

                  </div>
                </details>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;



