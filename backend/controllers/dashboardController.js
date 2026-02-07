import orderModel from "../models/orderModel.js";

const getDashboardStats = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    let totalItemsSold = 0;
    let totalRevenue = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let pendingCount = 0;

    orders.forEach(order => {
      // total money
      totalRevenue += order.amount;

      // total items sold
      order.items.forEach(item => {
        totalItemsSold += item.quantity;
      });

      // status based counts
      if (order.status === "Delivered") deliveredCount++;
      else if (order.status === "Cancelled") cancelledCount++;
      else pendingCount++;
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
