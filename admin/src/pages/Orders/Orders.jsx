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















import { useState } from 'react'
import './Orders.css'
import { toast } from "react-toastify"
import { useEffect } from 'react';
import { BsBoxSeamFill } from "react-icons/bs";
import { requestWithFallback } from '../../assets/api';
import { useNavigate } from "react-router-dom";


const Orders = ({ url }) => {

  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' +
      date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
  };

  const [orders, setOrders] = useState([]);
  // --- NEW SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllOrders = async () => {
    try {
      const response = await requestWithFallback('get', '/api/order/list');
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data?.message || 'Error');
      }
    } catch (err) {
      toast.error('Network error');
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await requestWithFallback('post', '/api/order/status', {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (err) {
      toast.error('Network error');
    }
  }

  // --- NEW DELETE FUNCTION ---
  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order permanently?")) {
        try {
          const response = await requestWithFallback('post', '/api/order/delete', { orderId });
          if (response.data.success) {
            toast.success(response.data.message);
            await fetchAllOrders();
          } else {
            toast.error('Error deleting order');
          }
        } catch (error) {
          toast.error('Network error');
        }
    }
  }

useEffect(() => {
  // First load
  fetchAllOrders();

  // 🔥 Auto refresh every 5 seconds
  const interval = setInterval(() => {
    fetchAllOrders();
  }, 5000);

  // Cleanup when component unmounts
  return () => clearInterval(interval);

}, []);


  // --- FILTERED ORDERS LOGIC ---
  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='order add'>
      <h3>Order Page</h3>

      {/* --- NEW SEARCH INPUT --- */}
      <div className="order-search">
        <input 
          type="text" 
          placeholder="Search by Order ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="order-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={index} className='order-item'>
              <BsBoxSeamFill className='box' />
              <div>
                <p className='oid'>{order._id}</p>
                <p className='order-item-food'>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity
                    }
                    else {
                      return item.name + " x " + item.quantity + ", "
                    }
                  })}
                </p>
                <p className="order-item-name">{(order.address?.firstName || "") + (order.address?.lastName ? " " + order.address.lastName : "") || "(No name)"}</p>

                <div className="order-item-address">
                  <p>{order.address?.email || "(No email)"}</p>
                  <p>{order.address?.address ? order.address.address + "." : ""}</p>
                  <p>{order.address?.city ? order.address.city + ". " : ""}</p>
                  <p>{formatDate(order.date)}</p>
                </div>
                <p className='order-item-phone'>{order.address?.phone || "(No phone)"}</p>
              </div>
              <p>Items : {order.items.length}</p>
              <p>{order.amount} TK</p>
              
              {/* ACTION CONTAINER FOR SELECT AND DELETE */}
              <div className='order-item-action'>
                <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Food Processed">Food Processed</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  className="invoice-btn"
                  disabled={order.status !== "Out for delivery" && order.status !== "Delivered"}
                  onClick={() => navigate("/invoice", { state: { order } })}
                >
                  Invoice
                </button>

                <button onClick={() => deleteOrder(order._id)} className='delete-order-btn'>X</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-orders">No orders found with that ID.</p>
        )}
      </div>
    </div>
  )
}

export default Orders
