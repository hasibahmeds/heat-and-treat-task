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
import { formatBDTime } from "../../utils/dateUtils";

const MyOrders = () => {
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loadingTrack, setLoadingTrack] = useState(null);
  const [loadingCancel, setLoadingCancel] = useState(null);

  const fetchOrders = async (orderId = null) => {
    if (orderId) setLoadingTrack(orderId);
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setData(response.data.data || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoadingTrack(null);
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
            const canAccessInvoice = ["Out for delivery", "Delivered"].includes(order.status);

            return (
              <div key={order._id} className="my-orders-order">
                <BsBoxSeamFill className="box" />

                <div className="order-info">
                  <p className="order-date">{formatBDTime(order.date)}</p>

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

                  <p className="order-item-count">Items: {order.items.length}</p>

                  <p className={`status ${order.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    <span>●</span> {order.status}
                  </p>
                </div>

                <div className="order-actions">
                  <button
                    onClick={() => fetchOrders(order._id)}
                    disabled={loadingTrack === order._id}
                    className="track-btn"
                  >
                    {loadingTrack === order._id ? "Tracking..." : "Track Order"}
                  </button>

                  <button
                    className="invoice-btn"
                    disabled={!canAccessInvoice}
                    onClick={() => canAccessInvoice && navigate("/invoice", { state: { order } })}
                  >
                    Invoice
                  </button>

                  {order.status === "Food Processing" && (
                    <details className="cancel-dropdown">
                      <summary>Cancel this order?</summary>
                      <div className="cancel-content">
                        <p className="hint">
                          Cancel option will be disabled within 15 minutes.
                        </p>
                        <button
                          className="confirm-cancel-btn"
                          onClick={() => cancelOrder(order._id)}
                          disabled={loadingCancel === order._id}
                        >
                          {loadingCancel === order._id ? "Cancelling..." : "Confirm Cancel"}
                        </button>
                      </div>
                    </details>
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



