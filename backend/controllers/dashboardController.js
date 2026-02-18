import orderModel from "../models/orderModel.js";
import refundModel from "../models/refundModel.js"; // ✅ NEW IMPORT

const getDashboardStats = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    const refunds = await refundModel.find({}); // ✅ GET REFUND DATA

    let totalItemsSold = 0;
    let totalRevenue = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let pendingCount = 0;

    // ===============================
    // ORDER CALCULATIONS (UNCHANGED)
    // ===============================
    orders.forEach(order => {

      // Total revenue from orders
      totalRevenue += order.amount;

      // Total items sold
      order.items.forEach(item => {
        totalItemsSold += item.quantity;
      });

      // Status counts
      if (order.status === "Delivered") deliveredCount++;
      else if (order.status === "Cancelled") cancelledCount++;
      else pendingCount++;
    });

    // ===============================
    // REFUND ADJUSTMENTS (NEW)
    // ===============================
    refunds.forEach(refund => {
      if (refund.addedAmount) {
        totalRevenue += refund.addedAmount;
      }
      if (refund.deletedAmount) {
        totalRevenue -= refund.deletedAmount;
      }
    });

    res.json({
      success: true,
      data: {
        totalItemsSold,
        totalRevenue,
        deliveredCount,
        cancelledCount,
        pendingCount
      }
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Dashboard Error" });
  }
};

export { getDashboardStats };
