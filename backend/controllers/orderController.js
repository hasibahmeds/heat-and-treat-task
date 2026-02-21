// youtube

// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// placing user order for frontend
// const placeOrder = async (req,res) => {

//     const frontend_url = "http://localhost:5173";
//     try {
//         const newOrder = new orderModel({
//             userId:req.body.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             address:req.body.address
//         })

//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

//         const line_items = req.body.items.map((item)=>({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price*100*80

//             },
//             quantity:item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:2*100*80

//             },
//             quantity:1
//         })

//         const session = await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:'payment',
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//         })

//         res.json({success:true,session_url:session.url})

        
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }


// const verifyOrder = async (req,res) =>{
//    const {orderId,success} = req.body;
//    try {
//         if (success=="true") {
//             await orderModel.findByIdAndUpdate(orderId, {payment:true});
//             res.json({success:true,message:"Paid"})
//         }
//         else {
//             await orderModel.findByIdAndDelete(orderId);
//             res.json({success:false,message:"Not Paid"})
//         }
//    } catch (error) {
//      console.log(error);
//      res.json({success:false,message:"Error"})
//    }
// }

// user orders for frontend

// const userOrders = async (req,res) => {
//     try {
//         const orders = await orderModel.find({userId:req.body.userId});
//         res.json({success:true,data:orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }

// listing orders for admin panel

// const listOrders = async (req,res) => {
//     try {
//         const orders = await orderModel.find({});
//         res.json({success:true,data:orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }
// }


// api for updating order status

// const updateStatus = async (req,res) => {
//     try {
//         await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
//         res.json({success:true,message:"Status Updated"})
//     } catch (error) {
//         console.log(error);
//          res.json({success:false,message:"Error"})
        
//     }
// }

// export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}
























// grook
// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";

// const placeOrder = async (req, res) => {
//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//       payment: true 
//     });

//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     res.json({ success: true, message: "Order Placed Successfully" });

//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };


// const userOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({ userId: req.body.userId });
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };


// const listOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({});
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };


// const updateStatus = async (req, res) => {
//   try {
//     await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
//     res.json({ success: true, message: "Status Updated" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// export { placeOrder, userOrders, listOrders, updateStatus };







































// orderController.js

// orderController.js

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// ❌ REMOVE this line:
// const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

// Placing user order (Cash on Delivery - No Stripe)


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





const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, userId } = req.body;

    if (!address?.deliveryArea) {
      return res.status(400).json({ success: false, message: "Delivery area is required" });
    }

    const selectedArea = address.deliveryArea;
    const expectedFee = DELIVERY_FEES[selectedArea] || 0;

    // Calculate real subtotal from items (do NOT trust frontend amount)
    const realSubtotal = items.reduce((sum, item) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);

    const expectedTotal = realSubtotal + expectedFee;

    // Allow small difference for rounding issues
    if (Math.abs(Number(amount) - expectedTotal) > 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount - delivery fee or subtotal mismatch"
      });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount: expectedTotal, // use calculated total for safety
      address,
      payment: true, // COD = considered paid
      paymentStatus: "pending" // or "cod" if you want to distinguish
    });

    await newOrder.save();

    // Clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// User orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// API for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// API for deleting an order
const deleteOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.body.orderId);
    res.json({ success: true, message: "Order Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting order" });
  }
};

export { placeOrder, userOrders, listOrders, updateStatus, deleteOrder };




// export { placeOrder, userOrders, listOrders, updateStatus };