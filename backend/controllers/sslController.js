import SSLCommerzPayment from "sslcommerz-lts";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = false;

// ================= INIT PAYMENT =================
export const sslInit = async (req, res) => {

  try {

        console.log("SSL INIT BODY:", req.body); // 👈 ADD THIS
    const userId = req.body.userId;
    const items = req.body.items || [];
    const amount = req.body.amount;
    const address = req.body.address || {};
    const customer = req.body.customer || {};

    const tran_id = "TXN_" + Date.now();

    // Normalize/merge address so admin UI has firstName/lastName/email/phone
    const nameParts = (customer.name || address.name || "").trim().split(" ");
    const firstNameFromName = nameParts.length ? nameParts[0] : "";
    const lastNameFromName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const addressMerged = {
      firstName: customer.firstName || address.firstName || firstNameFromName || "",
      lastName: customer.lastName || address.lastName || lastNameFromName || "",
      email: customer.email || address.email || "",
      phone: customer.phone || address.phone || "",
      street: address.street || address.address || customer.address || "",
      address: address.street || address.address || customer.address || "",
      city: address.city || customer.city || "",
      district: address.district || "",
    };

    // Create order first (PENDING) and save normalized address
    const order = await orderModel.create({
      userId,
      items,
      amount,
      address: addressMerged,
      payment: false,
      transactionId: tran_id,
      paymentStatus: "pending"
    });

    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id,
      success_url: "http://localhost:4000/api/order/ssl-success",
      fail_url: "http://localhost:4000/api/order/ssl-fail",
      cancel_url: "http://localhost:4000/api/order/ssl-cancel",
      ipn_url: "http://localhost:4000/api/order/ssl-ipn",


      // success_url: "https://heat-and-treat-task-backend.onrender.com/api/order/ssl-success",
      // fail_url: "https://heat-and-treat-task-backend.onrender.com/api/order/ssl-fail",
      // cancel_url: "https://heat-and-treat-task-backend.onrender.comapi/order/ssl-cancel",
      // ipn_url: "https://heat-and-treat-task-backend.onrender.com/api/order/ssl-ipn",


      shipping_method: "NO",
      product_name: items.map(i => i.name).join(", "),
      product_category: "Food",
      product_profile: "general",

      cus_name: (addressMerged.firstName || "") + (addressMerged.lastName ? " " + addressMerged.lastName : "") || "Customer",
      cus_email: addressMerged.email || "customer@email.com",
      cus_phone: addressMerged.phone || "01700000000",
      cus_add1: addressMerged.street || "Dhaka",
      cus_city: addressMerged.city || "Dhaka",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);
    console.log("SSL INIT RESPONSE:", apiResponse);

    // Return the raw API response so the frontend can use GatewayPageURL
    res.json(apiResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "SSL Init Failed" });
  }
};

// ================= SUCCESS =================
export const sslSuccess = async (req, res) => {
  console.log("SSL SUCCESS REQ =>", req.method, { body: req.body, query: req.query });

  // SSLCommerz may call this endpoint via POST (form) or redirect via GET with query params.
  const tran_id = req.body?.tran_id || req.query?.tran_id;

  if (!tran_id) {
    console.warn("sslSuccess: tran_id missing on request");
    return res.redirect("http://localhost:5173/myorders");
  }

  await orderModel.findOneAndUpdate(
    { transactionId: tran_id },
    { payment: true, paymentStatus: "paid" }
  );

  const order = await orderModel.findOne({ transactionId: tran_id });

  if (order) {
    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
  }

  res.redirect("http://localhost:5173/myorders");
};

// ================= FAIL =================
export const sslFail = async (req, res) => {
  console.log("SSL FAIL REQ =>", req.method, { body: req.body, query: req.query });

  const tran_id = req.body?.tran_id || req.query?.tran_id;

  if (tran_id) {
    await orderModel.findOneAndUpdate(
      { transactionId: tran_id },
      { paymentStatus: "failed" }
    );
  } else {
    console.warn("sslFail: tran_id missing on request");
  }

  res.redirect("http://localhost:5173/placeorder");
};

// ================= CANCEL =================
export const sslCancel = async (req, res) => {
  res.redirect("http://localhost:5173/placeorder");
};
