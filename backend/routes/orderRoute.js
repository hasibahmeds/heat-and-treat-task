// youtube


// import express from "express"
// import authMiddleware from "../middleware/auth.js"
// import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js"

// const orderRouter = express.Router();

// orderRouter.post("/place",authMiddleware,placeOrder);
// orderRouter.post("/verify",verifyOrder)
// orderRouter.post("/userorders",authMiddleware,userOrders)
// orderRouter.get('/list',listOrders)
// orderRouter.post('/status',updateStatus)

// export default orderRouter;











// import express from "express";
// import authMiddleware from "../middleware/auth.js";
// import { placeOrder, userOrders, listOrders, updateStatus, deleteOrder } from "../controllers/orderController.js";
// import SSLCommerzPayment from "sslcommerz-lts";

// const orderRouter = express.Router();

// orderRouter.post("/place", authMiddleware, placeOrder);
// orderRouter.post("/userorders", authMiddleware, userOrders);
// orderRouter.get('/list', listOrders);
// orderRouter.post('/status', updateStatus);
// orderRouter.post('/delete', deleteOrder);

// orderRouter.post("/ssl-init", async (req, res) => {
//   const { amount, currency, customer, items } = req.body;

//   const data = {
//     total_amount: amount,
//     currency: currency || "BDT",
//     tran_id: "TRANS_" + new Date().getTime(),
//     success_url: "http://localhost:5173/myorders",
//     fail_url: "http://localhost:5173/placeorder",
//     cancel_url: "http://localhost:5173/placeorder",
//     ipn_url: "http://localhost:4000/api/order/ssl-ipn",
//     shipping_method: "NO",
//     product_name: items.map(i => i.name).join(", "),
//     product_category: "Food",
//     product_profile: "general",
//     cus_name: customer.firstName + " " + customer.lastName,
//     cus_email: customer.email,
//     cus_add1: customer.address,
//     cus_city: customer.city,
//     cus_postcode: "0000",
//     cus_country: "Bangladesh",
//     cus_phone: customer.phone,
//     shipping_country: "Bangladesh"
//   };

//   const store_id = "heatt6984647a0a9e3";
//   const store_passwd = "heatt6984647a0a9e3@ssl";
//   const is_live = false;

//   const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
//   sslcommerz.init(data).then(paymentResponse => {
//     res.json(paymentResponse);
//   }).catch(err => {
//     console.log(err);
//     res.status(500).json({ success: false, message: "Payment initialization failed" });
//   });
// });

// export default orderRouter;

















import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  userOrders,
  listOrders,
  updateStatus,
  deleteOrder,
  getCancelledOrders,         // ← this line is probably missing or has typo
  updateRefundStatus
} from "../controllers/orderController.js";

import {
  sslInit,
  sslSuccess,
  sslFail,
  sslCancel
} from "../controllers/sslController.js";


const orderRouter = express.Router();

/* =====================================================
   CASH ON DELIVERY (EXISTING – DO NOT CHANGE)
===================================================== */
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.post("/delete", deleteOrder);

/* =====================================================
   SSLCommerz – ONLINE PAYMENT INIT
===================================================== */
// Delegate SSL routes to controller which creates the pending order
orderRouter.post("/ssl-init", authMiddleware, sslInit);
// Support both POST (IPN) and GET (redirect) methods from SSLCommerz
orderRouter.post("/ssl-success", sslSuccess);
orderRouter.get("/ssl-success", sslSuccess);
orderRouter.post("/ssl-fail", sslFail);
orderRouter.get("/ssl-fail", sslFail);
orderRouter.post("/ssl-cancel", sslCancel);
orderRouter.get("/ssl-cancel", sslCancel);





orderRouter.get("/cancelled", getCancelledOrders);
orderRouter.patch("/:id/refund-status", updateRefundStatus);

export default orderRouter;


