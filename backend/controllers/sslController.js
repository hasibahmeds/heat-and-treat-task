import SSLCommerzPayment from "sslcommerz-lts";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = false;

// ================= INIT PAYMENT =================
export const sslInit = async (req, res) => {
  try {
    console.log("SSL INIT BODY:", req.body);

    const userId = req.body.userId;
    const items = req.body.items || [];
    const amount = req.body.amount;
    const address = req.body.address || {};
    const customer = req.body.customer || {};

    const tran_id = "TXN_" + Date.now();

    // Normalize/merge address
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

    // Create order first (PENDING)
const order = await orderModel.create({
  userId,
  items,
  amount,
  address: addressMerged,
  deliveryArea: req.body.deliveryArea || addressMerged.city || "Unknown",
  deliveryCharge: req.body.deliveryCharge || 0,
  payment: false,
  transactionId: tran_id,
  paymentStatus: "pending"
});

    const backend_url =
      process.env.BACKEND_URL ||
      "https://heat-and-treat-task-backend.onrender.com";

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
      cus_add1: addressMerged.street || "Dhaka",
      cus_city: addressMerged.city || "Dhaka",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    console.log("SSL INIT RESPONSE:", apiResponse);

    res.json(apiResponse);

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "SSL Init Failed" });
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
    return res.redirect(`${frontend_url}/myorders`);
  }

  await orderModel.findOneAndUpdate(
    { transactionId: tran_id },
    { payment: true, paymentStatus: "paid" }
  );

  const order = await orderModel.findOne({ transactionId: tran_id });

  if (order) {
    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
  }

  res.redirect(`${frontend_url}/myorders`);
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
    await orderModel.findOneAndUpdate(
      { transactionId: tran_id },
      { paymentStatus: "failed" }
    );
  } else {
    console.warn("sslFail: tran_id missing");
  }

  res.redirect(`${frontend_url}/placeorder`);
};

// ================= CANCEL =================
export const sslCancel = async (req, res) => {
  const frontend_url =
    process.env.FRONTEND_URL ||
    req.headers.origin ||
    "http://localhost:5173";

  res.redirect(`${frontend_url}/placeorder`);
};
