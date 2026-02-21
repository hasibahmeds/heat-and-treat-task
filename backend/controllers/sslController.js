import SSLCommerzPayment from "sslcommerz-lts";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = false; // change to true in production

const DELIVERY_FEES = {
  "Motijheel": 50,
  "Shahbag": 40,
  "Dhanmondi": 30,
  "Farmgate": 30,
  "Agargaon": 40,
  "Mohammadpur": 50,
  "Mirpur": 50,
  "Gulshan": 60,
  "Banani": 60,
  "Uttara": 70
};

export const sslInit = async (req, res) => {
  try {
    const { amount, items, customer, address } = req.body;
    const userId = req.body.userId || req.user?.id; // depending on your auth

    if (!customer?.deliveryArea && !address?.deliveryArea) {
      return res.status(400).json({ success: false, message: "Delivery area is required" });
    }

    const selectedArea = customer?.deliveryArea || address?.deliveryArea;
    const expectedFee = DELIVERY_FEES[selectedArea] || 0;

    const realSubtotal = items.reduce((sum, item) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);

    const expectedTotal = realSubtotal + expectedFee;

    if (Math.abs(Number(amount) - expectedTotal) > 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount - delivery fee or subtotal mismatch"
      });
    }

    const tran_id = "TXN_" + Date.now();

    // Merge address data
    const addressMerged = {
      firstName: customer?.firstName || address?.firstName || "",
      lastName: customer?.lastName || address?.lastName || "",
      email: customer?.email || address?.email || "",
      phone: customer?.phone || address?.phone || "",
      address: address?.address || customer?.address || "",
      deliveryArea: selectedArea,
    };

    // Create pending order
    await orderModel.create({
      userId,
      items,
      amount: expectedTotal,
      address: addressMerged,
      payment: false,
      transactionId: tran_id,
      paymentStatus: "pending"
    });

    const backend_url = process.env.BACKEND_URL || "https://your-backend.onrender.com";

    const sslData = {
      total_amount: expectedTotal,
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
      cus_name: [addressMerged.firstName, addressMerged.lastName].filter(Boolean).join(" ") || "Customer",
      cus_email: addressMerged.email || "customer@email.com",
      cus_phone: addressMerged.phone || "01700000000",
      cus_add1: addressMerged.address || "Dhaka",
      cus_city: addressMerged.deliveryArea || "Dhaka",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(sslData);

    res.json(apiResponse);
  } catch (error) {
    console.error("SSL Init error:", error);
    res.status(500).json({ success: false, message: "Payment initialization failed" });
  }
};

// Keep your existing success/fail/cancel handlers
export const sslSuccess = async (req, res) => { /* ... */ };
export const sslFail = async (req, res) => { /* ... */ };
export const sslCancel = async (req, res) => { /* ... */ };