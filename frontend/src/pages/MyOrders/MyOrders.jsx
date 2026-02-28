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




// without (disappeard confirm cancel button after 15 minutes)


// import { useContext, useEffect, useState } from "react";
// import "./MyOrders.css";
// import { StoreContext } from "../../context/StoreContext";
// import axios from "axios";
// import { BsBoxSeamFill } from "react-icons/bs";
// import { useNavigate } from "react-router-dom";
// import { formatBDTime } from "../../utils/dateUtils";

// const MyOrders = () => {
//   const navigate = useNavigate();
//   const { url, token } = useContext(StoreContext);
//   const [data, setData] = useState([]);
//   const [loadingTrack, setLoadingTrack] = useState(null);
//   const [loadingCancel, setLoadingCancel] = useState(null);

//   const fetchOrders = async (orderId = null) => {
//     if (orderId) setLoadingTrack(orderId);
//     try {
//       const response = await axios.post(
//         url + "/api/order/userorders",
//         {},
//         { headers: { token } }
//       );
//       setData(response.data.data || []);
//     } catch (err) {
//       console.error("Fetch orders error:", err);
//     } finally {
//       setLoadingTrack(null);
//     }
//   };

//   const cancelOrder = async (orderId) => {
//     setLoadingCancel(orderId);
//     try {
//       await axios.post(url + "/api/order/status", {
//         orderId,
//         status: "Cancelled",
//       });
//       await fetchOrders();
//     } catch (err) {
//       console.error("Cancel order error:", err);
//     } finally {
//       setLoadingCancel(null);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchOrders();
//     }
//   }, [token]);


//   return (
//     <div className="my-orders">
//       <h2>My Orders</h2>

//       <div className="container">
//         {data.length === 0 ? (
//           <p className="no-orders">No orders found.</p>
//         ) : (
//           data.map((order) => {
//             const canAccessInvoice = ["Out for delivery", "Delivered"].includes(order.status);

//             return (
//               <div key={order._id} className="my-orders-order">
//                 <BsBoxSeamFill className="box" />

//                 <div className="order-info">
//                   <p className="order-date">{formatBDTime(order.date)}</p>

//                   <p className="order-items">
//                     {order.items
//                       .map((item, i) =>
//                         i === order.items.length - 1
//                           ? `${item.name} × ${item.quantity}`
//                           : `${item.name} × ${item.quantity}, `
//                       )
//                       .join("")}
//                   </p>

//                   <p className="order-amount">{order.amount} TK</p>

//                   <p className="order-item-count">Items: {order.items.length}</p>

//                   <p className={`status ${order.status.toLowerCase().replace(/\s+/g, "-")}`}>
//                     <span>●</span> {order.status}
//                   </p>
//                 </div>

//                 <div className="order-actions">
//                   <button
//                     onClick={() => fetchOrders(order._id)}
//                     disabled={loadingTrack === order._id}
//                     className="track-btn"
//                   >
//                     {loadingTrack === order._id ? "Tracking..." : "Track Order"}
//                   </button>

//                   <button
//                     className="invoice-btn"
//                     disabled={!canAccessInvoice}
//                     onClick={() => canAccessInvoice && navigate("/invoice", { state: { order } })}
//                   >
//                     Invoice
//                   </button>

//                   {order.status === "Food Processing" && (
//                     <details className="cancel-dropdown">
//                       <summary>Cancel this order?</summary>
//                       <div className="cancel-content">
//                         <p className="hint">
//                           Cancel option will be disabled within 15 minutes.
//                         </p>
//                         <button
//                           className="confirm-cancel-btn"
//                           onClick={() => cancelOrder(order._id)}
//                           disabled={loadingCancel === order._id}
//                         >
//                           {loadingCancel === order._id ? "Cancelling..." : "Confirm Cancel"}
//                         </button>
//                       </div>
//                     </details>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyOrders;


// without (disappeard confirm cancel button after 15 minutes)








import { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { BsBoxSeamFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { formatBDTime } from "../../utils/dateUtils";

const CANCELLATION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const getTimeRemaining = (orderDate) => {
  const orderTime = new Date(orderDate).getTime();
  const now = Date.now();
  const elapsed = now - orderTime;
  const remaining = CANCELLATION_WINDOW_MS - elapsed;
  return remaining > 0 ? remaining : 0;
};

const formatTimeLeft = (ms) => {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);

  const [data, setData] = useState([]);
  const [loadingTrack, setLoadingTrack] = useState(null);
  const [loadingCancel, setLoadingCancel] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(null); // ✅ NEW
  const [timeLeft, setTimeLeft] = useState({});

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      const orders = response.data.data || [];
      setData(orders);

      const initialTimes = {};
      orders.forEach((order) => {
        initialTimes[order._id] = getTimeRemaining(order.date);
      });
      setTimeLeft(initialTimes);
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  // ✅ Track Order Loading
  const handleTrackOrder = async (orderId) => {
    setLoadingTrack(orderId);
    try {
      await fetchOrders(); // your existing logic
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTrack(null);
    }
  };

  // ✅ Invoice Loading
  const handleInvoice = async (order) => {
    setLoadingInvoice(order._id);
    try {
      navigate("/invoice", { state: { order } });
    } finally {
      setTimeout(() => {
        setLoadingInvoice(null);
      }, 500); // small delay for UX smoothness
    }
  };

  const cancelOrder = async (orderId) => {
    setLoadingCancel(orderId);
    try {
      await axios.post(url + "/api/order/status", {
        orderId,
        status: "Cancelled",
      });
      await fetchOrders();
    } catch (err) {
      console.error("Cancel order error:", err);
    } finally {
      setLoadingCancel(null);
    }
  };

  // Live countdown
  useEffect(() => {
    if (data.length === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = { ...prev };
        let hasChange = false;

        data.forEach((order) => {
          const remaining = getTimeRemaining(order.date);
          if (remaining !== prev[order._id]) {
            updated[order._id] = remaining;
            hasChange = true;
          }
        });

        return hasChange ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          data.map((order) => {
            const remainingMs = timeLeft[order._id] ?? 0;
            const canCancel =
              remainingMs > 0 && order.status === "Food Processing";
            const timeText = formatTimeLeft(remainingMs);

            const canAccessInvoice = [
              "Out for delivery",
              "Delivered",
            ].includes(order.status);

            return (
              <div key={order._id} className="my-orders-order">
                <BsBoxSeamFill className="box" />
                <div className="order-info">
                  <p className="order-date">
                    {formatBDTime(order.date)}
                  </p>
                  <p className="order-items">
                    {order.items
                      .map((item, i) =>
                        i === order.items.length - 1
                          ? `${item.name} × ${item.quantity}`
                          : `${item.name} × ${item.quantity}, `
                      )
                      .join("")}
                  </p>
                  <p className="order-amount">{order.amount} TK</p>
                  <p className="order-item-count">
                    Items: {order.items.length}
                  </p>
                  <p
                    className={`status ${order.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    <span>●</span> {order.status}
                  </p>
                </div>

                <div className="order-actions">
                  {/* ✅ Track Button */}
                  <button
                    onClick={() => handleTrackOrder(order._id)}
                    disabled={loadingTrack === order._id}
                    className="track-btn"
                  >
                    {loadingTrack === order._id
                      ? "Tracking..."
                      : "Track Order"}
                  </button>

                  {/* ✅ Invoice Button */}
                  <button
                    className="invoice-btn"
                    disabled={
                      !canAccessInvoice ||
                      loadingInvoice === order._id
                    }
                    onClick={() =>
                      canAccessInvoice && handleInvoice(order)
                    }
                  >
                    {loadingInvoice === order._id
                      ? "Loading..."
                      : "Invoice"}
                  </button>

                  {/* ✅ Cancel Section */}
                  {order.status === "Food Processing" && (
                    <div className="cancel-section">
                      {canCancel ? (
                        <>
                          <div className="countdown-timer">
                            Time left to cancel:{" "}
                            <strong>{timeText}</strong>
                          </div>
                          <details className="cancel-dropdown">
                            <summary>Cancel this order?</summary>
                            <div className="cancel-content">
                              <p className="hint">
                                You can cancel within the next {timeText}.
                              </p>
                              <button
                                className="confirm-cancel-btn"
                                onClick={() =>
                                  cancelOrder(order._id)
                                }
                                disabled={
                                  loadingCancel === order._id
                                }
                              >
                                {loadingCancel === order._id
                                  ? "Cancelling..."
                                  : "Confirm Cancel"}
                              </button>
                            </div>
                          </details>
                        </>
                      ) : (
                        <div className="expired-notice">
                          Cancellation time has expired
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;



