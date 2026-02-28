import orderModel from "../models/orderModel.js";
import refundModel from "../models/refundModel.js"; // ✅ NEW IMPORT

const getDashboardStats = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    let totalItemsSold = 0;
    let totalRevenue = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let pendingCount = 0;

    orders.forEach(order => {
      // Always count items sold (even if later cancelled)
      order.items.forEach(item => {
        totalItemsSold += item.quantity;
      });

      // Revenue logic:
      // • Delivered → include
      // • Cancelled → include ONLY if refund NOT approved
      // • Others   → include (pending, processing, etc)
      if (order.status === "Delivered") {
        totalRevenue += order.amount;
        deliveredCount++;
      } 
      else if (order.status === "Cancelled") {
        cancelledCount++;
        if (order.refundStatus !== "approved") {
          totalRevenue += order.amount;   // still counted until refund approved
        }
      } 
      else {
        totalRevenue += order.amount;
        pendingCount++;
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
