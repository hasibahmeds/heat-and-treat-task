// import { useState } from 'react'
// import './Orders.css'
// import axios from 'axios';
// import {toast} from "react-toastify"
// import { useEffect } from 'react';
// import {assets} from "../../assets/assets.js"      last time not used
// import { BsBoxSeamFill } from "react-icons/bs";

// const Orders = ({url}) => {


//   const formatDate = (isoDate) => {
//   const date = new Date(isoDate);
//   return date.toLocaleDateString('en-US', {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric'
//   }) + ' ' +
//   date.toLocaleTimeString('en-US', {
//     hour: 'numeric',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true
//   });
// };

//   const [orders,setOrders] = useState([]);


//   const fetchAllOrders = async () => {
//     const response = await axios.get(url+"/api/order/list");         
//     if (response.data.success) {
//       setOrders(response.data.data);
//       console.log(response.data.data);
      
//     }
//     else{
//         toast.error("Error")
//     }
//   }


//   const statusHandler = async (event,orderId) => {
//   const response = await axios.post(url+"/api/order/status",{
//     orderId,
//     status:event.target.value
//   })

//   if (response.data.success) {
//     await fetchAllOrders();
//   }
      
//   }

//   useEffect(()=>{
//     fetchAllOrders();
//   },[])

//   return (
//     <div className='order add'>
//         <h3>Order Page</h3>
//         <div className="order-list">
//           {orders.map((order,index)=>(
//             <div key={index} className='order-item'>
//               <BsBoxSeamFill className='box' />
//               <div>
//                 <p className='order-item-food'>
//                     {order.items.map((item,index)=>{
//                         if (index===order.items.length-1) {
//                           return item.name + " x " + item.quantity 
//                         }
//                         else {
//                           return item.name + " x " + item.quantity + ", "
//                         }
//                     })}
//                 </p>
//                 <p className="order-item-name">{order.address.firstName+" "+order.address.lastName}</p>
//                 <div className="order-item-address">
//                   <p>{order.address.email}</p>
//                   <p>{order.address.street+","}</p>
//                   <p>{order.address.city+", "+order.address.district}</p>
//                   <p>{formatDate(order.date)}</p>
//                 </div>
//                   <p className='order-item-phone'>{order.address.phone}</p>
//               </div>
//               <p>Items : {order.items.length}</p>
//               <p>{order.amount} TK</p>
//               <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
//                 <option value="Food Processing">Food Processing</option>
//                 <option value="Out for delivery">Out for delivery</option>
//                 <option value="Delivered">Delivered</option>
//                 <option value="Cancelled">Cancelled</option>
//               </select>
//             </div>
//           ))}
//         </div>
//     </div>
//   )
// }

// export default Orders









 /* without (disappeard confirm cancel button after 15 minutes) */


// import { useState, useEffect } from "react";
// import "./Orders.css";
// import { toast } from "react-toastify";
// import { BsBoxSeamFill } from "react-icons/bs";
// import { requestWithFallback } from "../../assets/api";
// import { useNavigate } from "react-router-dom";
// import { formatBDTime } from "../../utils/dateUtils";  

// const Orders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   const fetchAllOrders = async () => {
//     try {
//       const response = await requestWithFallback("get", "/api/order/list");
//       if (response.data?.success) {
//         setOrders(response.data.data || []);
//       } else {
//         toast.error(response.data?.message || "Failed to load orders");
//       }
//     } catch (err) {
//       toast.error("Network error – cannot load orders");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusHandler = async (e, orderId) => {
//     const newStatus = e.target.value;
//     try {
//       const res = await requestWithFallback("post", "/api/order/status", {
//         orderId,
//         status: newStatus,
//       });
//       if (res.data?.success) {
//         toast.success(`Order updated to ${newStatus}`);
//         fetchAllOrders();
//       } else {
//         toast.error(res.data?.message || "Failed to update status");
//       }
//     } catch (err) {
//       toast.error("Failed to update status");
//       console.error(err);
//     }
//   };

//   const deleteOrder = async (orderId) => {
//     if (!window.confirm("Permanently delete this order? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       const res = await requestWithFallback("post", "/api/order/delete", { orderId });
//       if (res.data?.success) {
//         toast.success("Order deleted successfully");
//         fetchAllOrders();
//       } else {
//         toast.error(res.data?.message || "Failed to delete order");
//       }
//     } catch (err) {
//       toast.error("Network error while deleting order");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchAllOrders();
//     const interval = setInterval(fetchAllOrders, 10000); 
//     return () => clearInterval(interval);
//   }, []);

//   const filteredOrders = orders.filter((order) =>
//     order._id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return <div className="order add">Loading orders...</div>;
//   }

//   return (
//     <div className="order add">
//       <h3>Orders Management</h3>

//       <div className="order-search">
//         <input
//           type="text"
//           placeholder="Search by Order ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {filteredOrders.length === 0 ? (
//         <p className="no-orders">
//           {searchTerm ? "No matching orders found." : "No orders found."}
//         </p>
//       ) : (
//         <div className="order-list">
//           {filteredOrders.map((order) => (
//             <div key={order._id} className="order-item">
//               <BsBoxSeamFill className="box" />

//               <div>
//                 <p className="oid">{order._id}</p>

//                 <p className="order-item-food">
//                   {order.items
//                     .map((item) => `${item.name} × ${item.quantity}`)
//                     .join(", ")}
//                 </p>

//                 <p className="order-item-name">
//                   {order.address?.firstName || ""} {order.address?.lastName || ""}
//                   {!order.address?.firstName && !order.address?.lastName && "(No name)"}
//                 </p>

//                 <div className="order-item-address">
//                   <p>{order.address?.email || "—"}</p>
//                   <p>
//                     {order.address?.address || "—"}
//                     {order.address?.deliveryArea && (
//                       <span style={{ color: "#e67e22", fontWeight: 600 }}>
//                         {" "}
//                         {order.address.deliveryArea}

//                       </span>
//                     )}
//                   </p>
//                   <p className="order-date">
//                     {formatBDTime(order.date)}
//                   </p>
//                 </div>

//                 <p className="order-item-phone">
//                   {order.address?.phone || "—"}
//                 </p>
//               </div>

//               <p>Items: {order.items?.length || 0}</p>
//               <p>{order.amount || 0} TK</p>

//               <div className="order-item-action">
//                 <select
//                   onChange={(e) => statusHandler(e, order._id)}
//                   value={order.status || "Food Processing"}
//                 >
//                   <option value="Food Processing">Food Processing</option>
//                   <option value="Food Processed">Food Processed</option>
//                   <option value="Out for delivery">Out for delivery</option>
//                   <option value="Delivered">Delivered</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>

//                 <button
//                   className="invoice-btn"
//                   disabled={!["Out for delivery", "Delivered"].includes(order.status)}
//                   onClick={() => navigate("/invoice", { state: { order } })}
//                 >
//                   Invoice
//                 </button>

//                 <button
//                   onClick={() => deleteOrder(order._id)}
//                   className="delete-order-btn"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;


 /* without (disappeard confirm cancel button after 15 minutes) */






 /* without refund : pending /approved / rejected ? */



//  import { useState, useEffect } from "react";
// import "./Orders.css";
// import { toast } from "react-toastify";
// import { BsBoxSeamFill } from "react-icons/bs";
// import { requestWithFallback } from "../../assets/api";
// import { useNavigate } from "react-router-dom";
// import { formatBDTime } from "../../utils/dateUtils";

// const CANCELLATION_WINDOW_MS = 15 * 60 * 1000; 

// const getTimeRemaining = (orderDate) => {
//   const orderTime = new Date(orderDate).getTime();
//   const now = Date.now();
//   const elapsed = now - orderTime;
//   const remaining = CANCELLATION_WINDOW_MS - elapsed;
//   return remaining > 0 ? remaining : 0;
// };

// const formatTimeLeft = (ms) => {
//   if (ms <= 0) return "00:00";
//   const totalSeconds = Math.floor(ms / 1000);
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;
//   return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
// };

// const Orders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [timeLeft, setTimeLeft] = useState({}); 

//   const fetchAllOrders = async () => {
//     try {
//       const response = await requestWithFallback("get", "/api/order/list");
//       if (response.data?.success) {
//         const fetchedOrders = response.data.data || [];
//         setOrders(fetchedOrders);

        
//         const initialTimes = {};
//         fetchedOrders.forEach((order) => {
//           initialTimes[order._id] = getTimeRemaining(order.date);
//         });
//         setTimeLeft(initialTimes);
//       } else {
//         toast.error(response.data?.message || "Failed to load orders");
//       }
//     } catch (err) {
//       toast.error("Network error – cannot load orders");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusHandler = async (e, orderId) => {
//     const newStatus = e.target.value;
//     try {
//       const res = await requestWithFallback("post", "/api/order/status", {
//         orderId,
//         status: newStatus,
//       });
//       if (res.data?.success) {
//         toast.success(`Order updated to ${newStatus}`);
//         fetchAllOrders();
//       } else {
//         toast.error(res.data?.message || "Failed to update status");
//       }
//     } catch (err) {
//       toast.error("Failed to update status");
//       console.error(err);
//     }
//   };

//   const deleteOrder = async (orderId) => {
//     if (!window.confirm("Permanently delete this order? This action cannot be undone.")) {
//       return;
//     }
//     try {
//       const res = await requestWithFallback("post", "/api/order/delete", { orderId });
//       if (res.data?.success) {
//         toast.success("Order deleted successfully");
//         fetchAllOrders();
//       } else {
//         toast.error(res.data?.message || "Failed to delete order");
//       }
//     } catch (err) {
//       toast.error("Network error while deleting order");
//       console.error(err);
//     }
//   };

  
//   useEffect(() => {
//     if (orders.length === 0) return;

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => {
//         const updated = { ...prev };
//         let changed = false;
//         orders.forEach((order) => {
//           const remaining = getTimeRemaining(order.date);
//           if (remaining !== prev[order._id]) {
//             updated[order._id] = remaining;
//             changed = true;
//           }
//         });
//         return changed ? updated : prev;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [orders]);

//   useEffect(() => {
//     fetchAllOrders();
//     const interval = setInterval(fetchAllOrders, 10000); 
//     return () => clearInterval(interval);
//   }, []);

//   const filteredOrders = orders.filter((order) =>
//     order._id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return <div className="order add">Loading orders...</div>;
//   }

//   return (
//     <div className="order add">
//       <h3>Orders Management</h3>
//       <div className="order-search">
//         <input
//           type="text"
//           placeholder="Search by Order ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {filteredOrders.length === 0 ? (
//         <p className="no-orders">
//           {searchTerm ? "No matching orders found." : "No orders found."}
//         </p>
//       ) : (
//         <div className="order-list">
//           {filteredOrders.map((order) => {
//             const remainingMs = timeLeft[order._id] ?? 0;
//             const timeText = formatTimeLeft(remainingMs);

//             return (
//               <div key={order._id} className="order-item">
//                 <BsBoxSeamFill className="box" />
//                 <div>
//                   <p className="oid">{order._id}</p>
//                   <p className="order-item-food">
//                     {order.items
//                       .map((item) => `${item.name} × ${item.quantity}`)
//                       .join(", ")}
//                   </p>
//                   <p className="order-item-name">
//                     {order.address?.firstName || ""} {order.address?.lastName || ""}
//                     {!order.address?.firstName && !order.address?.lastName && "(No name)"}
//                   </p>
//                   <div className="order-item-address">
//                     <p>{order.address?.email || "—"}</p>
//                     <p>
//                       {order.address?.address || "—"}
//                       {order.address?.deliveryArea && (
//                         <span style={{ color: "#e67e22", fontWeight: 600 }}>
//                           {" "}
//                           {order.address.deliveryArea}
//                         </span>
//                       )}
//                     </p>
//                     <p className="order-date">{formatBDTime(order.date)}</p>
//                   </div>
//                   <p className="order-item-phone">{order.address?.phone || "—"}</p>

//                   {order.status === "Food Processing" && (
//                     <div className="admin-cancel-info">
//                       {remainingMs > 0 ? (
//                         <span className="countdown-admin">
//                           Cancel possible: {timeText} remaining
//                         </span>
//                       ) : (
//                         <span className="expired-admin">Cancellation expired</span>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <p>Items: {order.items?.length || 0}</p>
//                 <p>{order.amount || 0} TK</p>

//                 <div className="order-item-action">
//                   <select
//                     onChange={(e) => statusHandler(e, order._id)}
//                     value={order.status || "Food Processing"}
//                   >
//                     <option value="Food Processing">Food Processing</option>
//                     <option value="Food Processed">Food Processed</option>
//                     <option value="Out for delivery">Out for delivery</option>
//                     <option value="Delivered">Delivered</option>
//                     <option value="Cancelled">Cancelled</option>
//                   </select>

//                   <button
//                     className="invoice-btn"
//                     disabled={!["Out for delivery", "Delivered"].includes(order.status)}
//                     onClick={() => navigate("/invoice", { state: { order } })}
//                   >
//                     Invoice
//                   </button>

//                   <button
//                     onClick={() => deleteOrder(order._id)}
//                     className="delete-order-btn"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;

 /* without refund : pending /approved / rejected ? */












 import { useState, useEffect } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import { BsBoxSeamFill } from "react-icons/bs";
import { requestWithFallback } from "../../assets/api";
import { useNavigate } from "react-router-dom";
import { formatBDTime } from "../../utils/dateUtils";

const CANCELLATION_WINDOW_MS = 15 * 60 * 1000; // same 15 minutes

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
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({}); // orderId → remaining ms

  const fetchAllOrders = async () => {
    try {
      const response = await requestWithFallback("get", "/api/order/list");
      if (response.data?.success) {
        const fetchedOrders = response.data.data || [];
        setOrders(fetchedOrders);
        // Initialize countdowns
        const initialTimes = {};
        fetchedOrders.forEach((order) => {
          initialTimes[order._id] = getTimeRemaining(order.date);
        });
        setTimeLeft(initialTimes);
      } else {
        toast.error(response.data?.message || "Failed to load orders");
      }
    } catch (err) {
      toast.error("Network error – cannot load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    const newStatus = e.target.value;
    try {
      const res = await requestWithFallback("post", "/api/order/status", {
        orderId,
        status: newStatus,
      });
      if (res.data?.success) {
        toast.success(`Order updated to ${newStatus}`);
        fetchAllOrders();
      } else {
        toast.error(res.data?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Permanently delete this order? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await requestWithFallback("post", "/api/order/delete", { orderId });
      if (res.data?.success) {
        toast.success("Order deleted successfully");
        fetchAllOrders();
      } else {
        toast.error(res.data?.message || "Failed to delete order");
      }
    } catch (err) {
      toast.error("Network error while deleting order");
      console.error(err);
    }
  };

  // Live countdown update
  useEffect(() => {
    if (orders.length === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = { ...prev };
        let changed = false;
        orders.forEach((order) => {
          const remaining = getTimeRemaining(order.date);
          if (remaining !== prev[order._id]) {
            updated[order._id] = remaining;
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(fetchAllOrders, 10000); // refresh list every 10s
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="order add">Loading orders...</div>;
  }

  return (
    <div className="order add">
      <h3>Orders Management</h3>
      <div className="order-search">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="no-orders">
          {searchTerm ? "No matching orders found." : "No orders found."}
        </p>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => {
            const remainingMs = timeLeft[order._id] ?? 0;
            const timeText = formatTimeLeft(remainingMs);

            return (
              <div key={order._id} className="order-item">
                <BsBoxSeamFill className="box" />

                <div>
                  <p className="oid">{order._id}</p>
                  <p className="order-item-food">
                    {order.items
                      .map((item) => `${item.name} × ${item.quantity}`)
                      .join(", ")}
                  </p>
                  <p className="order-item-name">
                    {order.address?.firstName || ""} {order.address?.lastName || ""}
                    {!order.address?.firstName && !order.address?.lastName && "(No name)"}
                  </p>
                  <div className="order-item-address">
                    <p>{order.address?.email || "—"}</p>
                    <p>
                      {order.address?.address || "—"}
                      {order.address?.deliveryArea && (
                        <span style={{ color: "#e67e22", fontWeight: 600 }}>
                          {" "}
                          {order.address.deliveryArea}
                        </span>
                      )}
                    </p>
                    <p className="order-date">{formatBDTime(order.date)}</p>
                  </div>
                  <p className="order-item-phone">{order.address?.phone || "—"}</p>

                  {order.status === "Food Processing" && (
                    <div className="admin-cancel-info">
                      {remainingMs > 0 ? (
                        <span className="countdown-admin">
                          Cancel possible: {timeText} remaining
                        </span>
                      ) : (
                        <span className="expired-admin">Cancellation expired</span>
                      )}
                    </div>
                  )}

                  {/* Refund status display - added exactly after the cancel block */}
                  <div className="admin-refund-info">
                    Refund:{" "}
                    <strong className={`refund-status ${order.refundStatus || "pending"}`}>
                      {(order.refundStatus || "pending").toUpperCase()}
                    </strong>
                  </div>
                </div>

                <p>Items: {order.items?.length || 0}</p>
                <p>{order.amount || 0} TK</p>

                <div className="order-item-action">
                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status || "Food Processing"}
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Food Processed">Food Processed</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    className="invoice-btn"
                    disabled={!["Out for delivery", "Delivered"].includes(order.status)}
                    onClick={() => navigate("/invoice", { state: { order } })}
                  >
                    Invoice
                  </button>

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="delete-order-btn"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
