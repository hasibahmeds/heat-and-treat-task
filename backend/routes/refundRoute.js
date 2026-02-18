import express from "express";
import {
  addRefundAmount,
  deleteRefundAmount,
  getRefunds,
  clearRefunds,
  removeRefundById
} from "../controllers/refundController.js";

const refundRouter = express.Router();

refundRouter.post("/add", addRefundAmount);
refundRouter.post("/delete", deleteRefundAmount);
refundRouter.get("/list", getRefunds);
refundRouter.delete("/clear", clearRefunds);

// Remove single refund
refundRouter.delete("/remove/:id", removeRefundById);

export default refundRouter;
