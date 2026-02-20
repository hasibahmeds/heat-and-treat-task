// controllers/sslController.js
import SSLCommerzPayment from "sslcommerz-lts";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = false; // ! IMPORTANT: change to true when going live with real transactions

// ================= INIT PAYMENT =================
export const sslInit = async (req, res) => {
  try {
    console.log("SSL INIT BODY:", req.body);

    const { userId, items, amount, address, customer, deliveryCharge, deliveryArea } = req.body;

    const tran_id = "TXN_" + Date.now();

    // Normalize/merge address data
    const nameParts = (customer?.name || address?.name || "").trim().split(" ");
    const firstNameFromName = nameParts.length ? nameParts[0] : "";
    const lastNameFromName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const addressMerged = {
      firstName: customer?.firstName || address?.firstName || firstNameFromName || "",
      lastName: customer?.lastName || address?.lastName || lastNameFromName || "",
      email: customer?.email || address?.email || "",
      phone: customer?.phone || address?.phone || "",
      address: address?.address || address?.street || customer?.address || "",
      deliveryArea: deliveryArea || address?.deliveryArea || "",          // ← new: save delivery area
      // You can keep city/district if still needed somewhere else, but not used for fee now
    };

    // Create pending order
    const order = await orderModel.create({
      userId,
      items,
      amount,
      address: addressMerged,
      deliveryArea: deliveryArea || address?.deliveryArea || "",         // ← new
      deliveryCharge: deliveryCharge || 0,                               // ← new: save the selected fee
      payment: false,
      transactionId: tran_id,
      paymentStatus: "pending"
    });

    const backend_url =
      process.env.BACKEND_URL ||
      "https://heat-and-treat-task-backend.onrender.com";

    const frontend_url = process.env.FRONTEND_URL || req.headers.origin || "http://localhost:5173";

    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id,
      success_url: `${backend_url}/api/order/ssl-success`,
      fail_url: `${backend_url}/api/order/ssl-fail`,
      cancel_url: `${backend_url}/api/order/ssl-cancel`,
      ipn_url: `${backend_url}/api/order/ssl-ipn`,
      shipping_method: "NO",
      product_name: items.map(i => i.name).join(", "),
      product_category: "Food",
      product_profile: "general",
      cus_name:
        (addressMerged.firstName || "") +
        (addressMerged.lastName ? " " + addressMerged.lastName : "") ||
        "Customer",
      cus_email: addressMerged.email || "customer@email.com",
      cus_phone: addressMerged.phone || "01700000000",
      cus_add1: addressMerged.address || "Dhaka",
      cus_city: addressMerged.deliveryArea || "Dhaka",                    // using deliveryArea here for SSL
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    console.log("SSL INIT RESPONSE:", apiResponse);

    res.json(apiResponse);

  } catch (error) {
    console.error("SSL Init Error:", error);
    res.status(500).json({ success: false, message: "SSL Init Failed", error: error.message });
  }
};

// ================= SUCCESS =================
export const sslSuccess = async (req, res) => {
  console.log("SSL SUCCESS REQ =>", req.method, { body: req.body, query: req.query });

  const frontend_url =
    process.env.FRONTEND_URL ||
    req.headers.origin ||
    "http://localhost:5173";

  const tran_id = req.body?.tran_id || req.query?.tran_id;

  if (!tran_id) {
    console.warn("sslSuccess: tran_id missing");
    return res.redirect(`${frontend_url}/myorders?error=missing_tran_id`);
  }

  try {
    // Update order status to paid
    const updatedOrder = await orderModel.findOneAndUpdate(
      { transactionId: tran_id },
      { 
        payment: true, 
        paymentStatus: "paid",
        // Optional: you can store more SSL response data if needed
        // sslResponse: req.body
      },
      { new: true }
    );

    if (updatedOrder && updatedOrder.userId) {
      // Clear user's cart
      await userModel.findByIdAndUpdate(updatedOrder.userId, { cartData: {} });
      console.log(`Cart cleared for user ${updatedOrder.userId} after successful payment`);
    }

    // Redirect to my orders (or success page if you have one)
    res.redirect(`${frontend_url}/myorders?success=true`);
  } catch (err) {
    console.error("Error in sslSuccess:", err);
    res.redirect(`${frontend_url}/myorders?error=payment_processing_failed`);
  }
};

// ================= FAIL =================
export const sslFail = async (req, res) => {
  console.log("SSL FAIL REQ =>", req.method, { body: req.body, query: req.query });

  const frontend_url =
    process.env.FRONTEND_URL ||
    req.headers.origin ||
    "http://localhost:5173";

  const tran_id = req.body?.tran_id || req.query?.tran_id;

  if (tran_id) {
    try {
      await orderModel.findOneAndUpdate(
        { transactionId: tran_id },
        { paymentStatus: "failed" }
      );
    } catch (err) {
      console.error("Error updating failed order:", err);
    }
  } else {
    console.warn("sslFail: tran_id missing");
  }

  res.redirect(`${frontend_url}/placeorder?error=payment_failed`);
};

// ================= CANCEL =================
export const sslCancel = async (req, res) => {
  const frontend_url =
    process.env.FRONTEND_URL ||
    req.headers.origin ||
    "http://localhost:5173";

  const tran_id = req.body?.tran_id || req.query?.tran_id;

  if (tran_id) {
    try {
      await orderModel.findOneAndUpdate(
        { transactionId: tran_id },
        { paymentStatus: "cancelled" }
      );
    } catch (err) {
      console.error("Error updating cancelled order:", err);
    }
  }

  res.redirect(`${frontend_url}/placeorder?cancelled=true`);
};